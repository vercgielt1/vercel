import bytes from 'bytes';
import chalk from 'chalk';
import { FileFsRef } from '@now/build-utils';
import { join, relative } from 'path';
import { createFunction } from '@zeit/fun';
import ignore, { Ignore } from '@zeit/dockerignore';
import { readFile, stat, mkdirp } from 'fs-extra';

import { globBuilderInputs } from './glob';
import DevServer from './dev-server';
import wait from '../../../util/output/wait';
import IGNORED from '../../../util/ignored';
import { NowError } from '../../../util/now-error';
import { installBuilders, getBuilder, cacheDirPromise } from './builder-cache';
import {
  NowConfig,
  BuildConfig,
  BuilderInputs,
  BuilderOutput,
  BuilderOutputs,
  BuiltLambda
} from './types';

/**
 * Build project to statics & lambdas
 */
export async function buildUserProject(
  nowJson: NowConfig,
  devServer: DevServer
): Promise<void> {
  try {
    devServer.setStatusBusy('Installing builders');
    const builds = nowJson.builds || [];
    await installBuilders(builds.map(build => build.use));

    devServer.setStatusBusy('Building lambdas');
    await executeBuilds(nowJson, devServer);

    devServer.setStatusIdle();
  } catch (err) {
    devServer.setStatusIdle();
    throw err;
  }
}

export async function executeBuild(
  nowJson: NowConfig,
  devServer: DevServer,
  asset: BuilderOutput
): Promise<void> {
  const { buildConfig, buildEntry } = asset;
  if (!buildConfig || !buildEntry) {
    throw new Error("Asset has not been built yet, can't rebuild");
  }
  const { cwd } = devServer;
  const entrypoint = relative(cwd, buildEntry.fsPath);

  const cacheDir = await cacheDirPromise;
  const { dev, ino } = await stat(entrypoint);
  const workPath = join(cacheDir, 'workPaths', String(dev + ino));
  await mkdirp(workPath);

  devServer.logDebug(`Building ${buildEntry.fsPath} (workPath = ${workPath})`);
  const { builder } = buildConfig;
  if (!builder) {
    throw new Error('No builder');
  }
  const builderConfig = builder.config || {};
  const files = await collectProjectFiles('**', cwd);
  const config = buildConfig.config || {};
  const output = await builder.build({
    files,
    entrypoint,
    workPath,
    config,
    isDev: true
  });

  // enforce the lambda zip size soft watermark
  const { maxLambdaSize = '5mb' } = { ...builderConfig, ...config };
  let maxLambdaBytes: number;
  if (typeof maxLambdaSize === 'string') {
    maxLambdaBytes = bytes(maxLambdaSize);
  } else {
    maxLambdaBytes = maxLambdaSize;
  }

  for (const asset of Object.values(output)) {
    if (asset.type === 'Lambda') {
      const size = asset.zipBuffer.length;
      if (size > maxLambdaBytes) {
        throw new Error(
          `The lambda function size (${bytes(
            size
          ).toLowerCase()}) exceeds the configured limit (${bytes(
            maxLambdaBytes
          ).toLowerCase()}). You may increase this by supplying \`maxLambdaSize\` to the build \`config\``
        );
      }
    }

    asset.buildConfig = buildConfig;
    asset.buildEntry = buildEntry;
  }

  await Promise.all(
    Object.entries(output).map(async e => {
      const path: string = e[0];
      const asset: BuilderOutput = e[1];
      if (asset.type !== 'Lambda') return;

      // Tear down the previous `fun` Lambda instance for this asset
      const oldAsset = devServer.assets[path];
      if (oldAsset && oldAsset.type === 'Lambda' && oldAsset.fn) {
        await oldAsset.fn.destroy();
      }

      asset.fn = await createFunction({
        Code: { ZipFile: asset.zipBuffer },
        Handler: asset.handler,
        Runtime: asset.runtime,
        Environment: {
          Variables: {
            // TODO: resolve secret env vars
            ...nowJson.env,
            ...asset.environment,
            NOW_REGION: 'dev1'
          }
        }
      });
    })
  );

  // TODO: remove previous assets, i.e. if the rebuild has different outputs that
  // don't include some of the previous ones. For example, deleting a page in
  // a Next.js build
  Object.assign(devServer.assets, output);
}

async function executeBuilds(
  nowJson: NowConfig,
  devServer: DevServer
): Promise<void> {
  const { cwd } = devServer;
  const files = await collectProjectFiles('**', cwd);

  if (!nowJson.builds) {
    return;
  }

  const cacheDir = await cacheDirPromise;

  for (const build of nowJson.builds) {
    try {
      devServer.logDebug(`Build ${JSON.stringify(build)}`);
      const builder = await getBuilder(build.use);
      build.builder = builder;

      let { src } = build;
      if (src[0] === '/') {
        // Remove a leading slash so that the globbing is relative to `cwd`
        // instead of the root of the filesystem. This matches the behavior
        // of Now deployments.
        src = src.substring(1);
      }
      const entries = Object.values(await collectProjectFiles(src, cwd));

      for (const entry of entries) {
        const config = build.config || {};
        const entrypoint = relative(cwd, entry.fsPath);

        const { dev, ino } = await stat(entrypoint);
        const workPath = join(cacheDir, 'workPaths', String(dev + ino));
        await mkdirp(workPath);

        devServer.logDebug(`Building ${entry.fsPath} (workPath = ${workPath})`);
        const output = await builder.build({
          files,
          entrypoint,
          workPath,
          config,
          isDev: true
        });

        // enforce the lambda zip size soft watermark
        const builderConfig = builder.config || {};
        const { maxLambdaSize = '5mb' } = { ...builderConfig, ...config };
        let maxLambdaBytes: number;
        if (typeof maxLambdaSize === 'string') {
          maxLambdaBytes = bytes(maxLambdaSize);
        } else {
          maxLambdaBytes = maxLambdaSize;
        }

        for (const asset of Object.values(output)) {
          if (asset.type === 'Lambda') {
            const size = asset.zipBuffer.length;
            if (size > maxLambdaBytes) {
              throw new Error(
                `The lambda function size (${bytes(
                  size
                ).toLowerCase()}) exceeds the configured limit (${bytes(
                  maxLambdaBytes
                ).toLowerCase()}). You may increase this by supplying \`maxLambdaSize\` to the build \`config\``
              );
            }
          }

          asset.buildConfig = build;
          asset.buildEntry = entry;
        }

        Object.assign(devServer.assets, output);
      }
    } catch (err) {
      throw err;
      /*
      throw new NowError({
        code: 'NOW_BUILDER_FAILURE',
        message: `Failed building ${chalk.bold(build.src)} with ${build.use}`,
        meta: err.stack
      });
      */
    }
  }

  await Promise.all(
    Object.values(devServer.assets).map(async (asset: BuilderOutput) => {
      if (asset.type !== 'Lambda') return;
      asset.fn = await createFunction({
        Code: { ZipFile: asset.zipBuffer },
        Handler: asset.handler,
        Runtime: asset.runtime,
        Environment: {
          Variables: {
            // TODO: resolve secret env vars
            ...nowJson.env,
            ...asset.environment,
            NOW_REGION: 'dev1'
          }
        }
      });
    })
  );
}

/**
 * Collect project files, with .gitignore and .nowignore honored.
 */
export async function collectProjectFiles(
  pattern: string,
  cwd: string
): Promise<BuilderInputs> {
  const ignore = await createIgnoreList(cwd);
  const files = await globBuilderInputs(pattern, { cwd, ignore });
  return files;
}

/**
 * Create ignore list according .gitignore & .nowignore in cwd
 */
export async function createIgnoreList(cwd: string): Promise<Ignore> {
  const ig = ignore();

  // Add the default ignored files
  ig.add(IGNORED);

  // Special case for now-cli's usage
  ig.add('.nowignore');

  // Temp workround for excluding ncc/ & user/ folder generated by builders
  // should be removed later.
  ig.add('ncc');
  ig.add('user');

  try {
    const gitignore = join(cwd, '.gitignore');
    ig.add(await readFile(gitignore, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  try {
    const nowignore = join(cwd, '.nowignore');
    ig.add(await readFile(nowignore, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  return ig;
}

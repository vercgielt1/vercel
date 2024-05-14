import http from 'http';
import { ChildProcess } from 'child_process';
import { Lambda as FunLambda } from '@vercel/fun';
import {
  Builder as BuildConfig,
  BuildOptions,
  PrepareCacheOptions,
  ShouldServeOptions,
  StartDevServerOptions,
  StartDevServerResult,
  Env,
  FileBlob,
  FileFsRef,
  Lambda,
} from '@vercel/build-utils';
import { VercelConfig } from '@vercel/client';
import { HandleValue, Route } from '@vercel/routing-utils';
import { Output } from '../output';
import type { ProjectSettings } from '@vercel-internals/types';
import { BuilderWithPkg } from '../build/import-builders';
import { PullEnvRecordsResponse } from '../env/get-env-records';

export { VercelConfig };

export interface DevServerOptions {
  output: Output;
  projectSettings?: ProjectSettings;
  envValues?: PullEnvRecordsResponse;
  repoRoot?: string;
}

export interface EnvConfigs {
  /**
   * environment variables from `.env.build` file
   */
  buildEnv: Env;

  /**
   * environment variables from `.env` file
   */
  runEnv: Env;

  /**
   * environment variables from `.env` and `.env.build`
   */
  allEnv: Env;
}

export interface BuildMatch extends BuildConfig {
  entrypoint: string;
  src: string;
  builderWithPkg: BuilderWithPkg;
  buildOutput: BuilderOutputs;
  buildResults: Map<string | null, BuildResult>;
  buildTimestamp: number;
  buildProcess?: ChildProcess;
}

export interface HttpHandler {
  (req: http.IncomingMessage, res: http.ServerResponse): void;
}

export interface BuilderInputs {
  [path: string]: FileFsRef;
}

export interface BuiltLambda extends Lambda {
  zipBuffer: Buffer;
  fn?: FunLambda;
}

export type BuilderOutput = BuiltLambda | FileFsRef | FileBlob;

export interface BuilderOutputs {
  [path: string]: BuilderOutput;
}

export type CacheOutput = FileFsRef | FileBlob;

export interface CacheOutputs {
  [path: string]: CacheOutput;
}

export interface BuilderConfigAttr {
  maxLambdaSize?: string | number;
}

export interface Builder {
  version?: 1 | 2 | 3 | 4;
  config?: BuilderConfigAttr;
  build(
    opts: BuildOptions
  ):
    | BuilderOutputs
    | BuildResult
    | Promise<BuilderOutputs>
    | Promise<BuildResult>;
  prepareCache?(
    opts: PrepareCacheOptions
  ): CacheOutputs | Promise<CacheOutputs>;
  shouldServe?(params: ShouldServeOptions): boolean | Promise<boolean>;
  startDevServer?(opts: StartDevServerOptions): Promise<StartDevServerResult>;
}

export interface BuildResult {
  output: BuilderOutputs;
  routes: Route[];
  watch: string[];
  distPath?: string;
}

export interface BuildResultV3 {
  output: Lambda;
  routes: Route[];
  watch: string[];
  distPath?: string;
}

export interface BuildResultV4 {
  output: { [filePath: string]: Lambda };
  routes: Route[];
  watch: string[];
  distPath?: string;
}

export interface HttpHeadersConfig {
  [name: string]: string;
}

export interface RouteResult {
  // `true` if a route was matched, `false` otherwise
  found: boolean;
  // "dest": <string of the dest, either file for lambda or full url for remote>
  dest: string;
  // `true` if last route in current phase matched but set `continue: true`
  continue: boolean;
  // "status": <integer in case exit code is intended to be changed>
  status?: number;
  // "headers": <object of the added response header values>
  headers: HttpHeadersConfig;
  // "query": <object (key=values) of new uri args to be passed along to dest>
  query?: Record<string, string[]>;
  // "matched_route": <object of the route spec that matched>
  matched_route?: Route;
  // "matched_route_idx": <integer of the index of the route matched>
  matched_route_idx?: number;
  // "userDest": <boolean in case the destination was user defined>
  userDest?: boolean;
  // url as destination should end routing
  isDestUrl: boolean;
  // the phase that this route is defined in
  phase?: HandleValue | null;
}

export interface InvokePayload {
  method: string;
  host?: string;
  path: string;
  headers: http.IncomingHttpHeaders;
  encoding?: string;
  body?: string;
}

export interface InvokeResult {
  statusCode: number;
  headers: HttpHeadersConfig;
  encoding?: string;
  body?: string;
}

export type SocketSpec = [string];
export type HostPortSpec = [number, string?];
export type ListenSpec = SocketSpec | HostPortSpec;

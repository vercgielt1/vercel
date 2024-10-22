import chalk from 'chalk';
import ms from 'ms';
import table from '../../util/output/table';
import type { Project } from '@vercel-internals/types';
import Client from '../../util/client';
import getCommandFlags from '../../util/get-command-flags';
import { getCommandName } from '../../util/pkg-name';
import { NODE_VERSIONS } from '@vercel/build-utils';
import output from '../../output-manager';

export default async function list(
  client: Client,
  argv: any,
  args: string[],
  contextName: string
) {
  if (args.length !== 0) {
    output.error(
      `Invalid number of arguments. Usage: ${chalk.cyan(
        `${getCommandName('project ls')}`
      )}`
    );
    return 2;
  }

  const start = Date.now();

  output.spinner(`Fetching projects in ${chalk.bold(contextName)}`);

  let projectsUrl = `/v9/projects?limit=20`;

  const deprecated = argv['--update-required'] || false;
  if (deprecated) {
    projectsUrl += `&deprecated=${deprecated}`;
  }

  const next = argv['--next'] || false;
  if (next) {
    projectsUrl += `&until=${next}`;
  }

  let {
    projects: projectList,
    pagination,
  }: {
    projects: Project[];
    pagination: { count: number; next: number };
  } = await client.fetch(projectsUrl, {
    method: 'GET',
  });

  output.stopSpinner();

  const elapsed = ms(Date.now() - start);

  if (deprecated) {
    const upcomingDeprecationVersionsList = [];

    for (const nodeVersion of NODE_VERSIONS) {
      if (
        nodeVersion.discontinueDate &&
        nodeVersion.discontinueDate.valueOf() > Date.now()
      ) {
        upcomingDeprecationVersionsList.push(nodeVersion.range);
      }
    }

    output.warn(
      `The following Node.js versions will be deprecated soon: ${upcomingDeprecationVersionsList.join(
        ', '
      )}. Please upgrade your projects immediately.`
    );
    output.log(
      `For more information visit: https://vercel.com/docs/functions/serverless-functions/runtimes/node-js#node.js-version`
    );
  }

  output.log(
    `${
      projectList.length > 0 ? 'Projects' : 'No projects'
    } found under ${chalk.bold(contextName)} ${
      deprecated ? 'that are using a deprecated Node.js version' : '\b'
    } ${chalk.gray(`[${elapsed}]`)}`
  );

  if (projectList.length > 0) {
    const tablePrint = table(
      [
        ['Project Name', 'Latest Production URL', 'Updated'].map(header =>
          chalk.bold(chalk.cyan(header))
        ),
        ...projectList
          .map(project => [
            [
              chalk.bold(project.name),
              getLatestProdUrl(project),
              chalk.gray(ms(Date.now() - project.updatedAt)),
            ],
          ])
          .flat(),
      ],
      { hsep: 3 }
    ).replace(/^/gm, '  ');
    output.print(`\n${tablePrint}\n\n`);

    if (pagination && pagination.count === 20) {
      const flags = getCommandFlags(argv, ['_', '--next', '-N', '-d', '-y']);
      const nextCmd = `project ls${flags} --next ${pagination.next}`;
      output.log(`To display the next page, run ${getCommandName(nextCmd)}`);
    }
  }
  return 0;
}

function getLatestProdUrl(project: Project): string {
  const alias = project.targets?.production?.alias?.[0];
  if (alias) return 'https://' + alias;
  return '--';
}

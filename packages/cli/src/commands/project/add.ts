import chalk from 'chalk';
import ms from 'ms';
import Client from '../../util/client';
import { isAPIError } from '../../util/errors-ts';
import { getCommandName } from '../../util/pkg-name';
import createProject from '../../util/projects/create-project';
import output from '../../output-manager';

export default async function add(
  client: Client,
  args: string[],
  contextName: string
) {
  if (args.length !== 1) {
    output.error(
      `Invalid number of arguments. Usage: ${chalk.cyan(
        `${getCommandName('project add <name>')}`
      )}`
    );

    if (args.length > 1) {
      const example = chalk.cyan(
        `${getCommandName(`project add "${args.join(' ')}"`)}`
      );
      output.log(
        `If your project name  has spaces, make sure to wrap it in quotes. Example: \n  ${example} `
      );
    }

    return 1;
  }

  const start = Date.now();

  const [name] = args;

  try {
    await createProject(client, { name });
  } catch (err: unknown) {
    if (isAPIError(err) && err.code === 'too_many_projects') {
      output.prettyError(err);
      return 1;
    }
    if (isAPIError(err) && err.status === 409) {
      // project already exists, so we can
      // show a success message
    } else {
      throw err;
    }
  }
  const elapsed = ms(Date.now() - start);

  output.log(
    `${chalk.cyan('Success!')} Project ${chalk.bold(
      name.toLowerCase()
    )} added (${chalk.bold(contextName)}) ${chalk.gray(`[${elapsed}]`)}`
  );
  return;
}

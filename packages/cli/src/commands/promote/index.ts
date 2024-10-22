import type Client from '../../util/client';
import { parseArguments } from '../../util/get-args';
import getProjectByCwdOrLink from '../../util/projects/get-project-by-cwd-or-link';
import handleError from '../../util/handle-error';
import { isErrnoException } from '@vercel/error-utils';
import ms from 'ms';
import requestPromote from './request-promote';
import promoteStatus from './status';
import { promoteCommand } from './command';
import { help } from '../help';
import { getFlagsSpecification } from '../../util/get-flags-specification';
import { PromoteTelemetryClient } from '../../util/telemetry/commands/promote';
import output from '../../output-manager';

/**
 * `vc promote` command
 * @param {Client} client
 * @returns {Promise<number>} Resolves an exit code; 0 on success
 */
export default async (client: Client): Promise<number> => {
  let parsedArgs = null;

  const flagsSpecification = getFlagsSpecification(promoteCommand.options);

  // Parse CLI args
  try {
    parsedArgs = parseArguments(client.argv.slice(2), flagsSpecification);
  } catch (error) {
    handleError(error);
    return 1;
  }

  const telemetry = new PromoteTelemetryClient({
    opts: {
      store: client.telemetryEventStore,
    },
  });

  if (parsedArgs.flags['--help']) {
    output.print(help(promoteCommand, { columns: client.stderr.columns }));
    return 2;
  }

  const yes = parsedArgs.flags['--yes'] ?? false;
  telemetry.trackCliFlagYes(parsedArgs.flags['--yes']);

  // validate the timeout
  let timeout = parsedArgs.flags['--timeout'];
  if (timeout && ms(timeout) === undefined) {
    output.error(`Invalid timeout "${timeout}"`);
    return 1;
  }

  telemetry.trackCliOptionTimeout(parsedArgs.flags['--timeout']);

  const actionOrDeployId = parsedArgs.args[1] || 'status';

  try {
    if (actionOrDeployId === 'status') {
      telemetry.trackCliSubcommandStatus();
      const project = await getProjectByCwdOrLink({
        autoConfirm: Boolean(parsedArgs.flags['--yes']),
        client,
        commandName: 'promote',
        cwd: client.cwd,
        projectNameOrId: parsedArgs.args[2],
      });

      return await promoteStatus({
        client,
        project,
        timeout,
      });
    }

    return await requestPromote({
      client,
      deployId: actionOrDeployId,
      timeout,
      yes,
    });
  } catch (err) {
    if (isErrnoException(err)) {
      if (err.code === 'ERR_CANCELED') {
        return 0;
      }
      if (err.code === 'ERR_INVALID_CWD' || err.code === 'ERR_LINK_PROJECT') {
        // do not show the message
        return 1;
      }
    }

    output.prettyError(err);
    return 1;
  }
};

import chalk from 'chalk';
import type { CustomEnvironment } from '@vercel-internals/types';
import output from '../../output-manager';

export function formatEnvironment(
  orgSlug: string,
  projectSlug: string,
  environment: Pick<CustomEnvironment, 'name' | 'id'>
) {
  const projectUrl = `https://vercel.com/${orgSlug}/${projectSlug}`;
  const boldName = chalk.bold(environment.name);
  return output.link(
    boldName,
    `${projectUrl}/settings/environments/${environment.id}`,
    { fallback: () => boldName, color: false }
  );
}

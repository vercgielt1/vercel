import chalk from 'chalk';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Response } from 'node-fetch';
import { DomainNotFound, InvalidDomain, isAPIError } from '../errors-ts';
import Client from '../client';
import { Headers } from 'node-fetch';

type JSONResponse = {
  recordIds: string[];
};

export default async function importZonefile(
  client: Client,
  contextName: string,
  domain: string,
  zonefilePath: string
) {
  client.output.spinner(
    `Importing Zone file for domain ${domain} under ${chalk.bold(contextName)}`
  );
  const zonefile = readFileSync(resolve(zonefilePath), 'utf8');

  try {
    const res = await client.fetch<Response>(
      `/v3/domains/${encodeURIComponent(domain)}/records`,
      {
        headers: new Headers({ 'Content-Type': 'text/dns' }),
        body: zonefile,
        method: 'PUT',
        json: false,
      }
    );

    const { recordIds } = (await res.json()) as JSONResponse;
    return recordIds;
  } catch (err: unknown) {
    if (isAPIError(err)) {
      if (err.code === 'not_found') {
        return new DomainNotFound(domain, contextName);
      }

      if (err.code === 'invalid_domain') {
        return new InvalidDomain(domain);
      }
    }

    throw err;
  }
}

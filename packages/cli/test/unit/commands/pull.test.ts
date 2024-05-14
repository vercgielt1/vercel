import { describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import pull from '../../../src/commands/pull';
import { setupUnitFixture } from '../../helpers/setup-unit-fixture';
import { client } from '../../mocks/client';
import { defaultProject, useProject } from '../../mocks/project';
import { useTeams } from '../../mocks/team';
import { useUser } from '../../mocks/user';

describe('pull', () => {
  it('should handle pulling', async () => {
    const cwd = setupUnitFixture('vercel-pull-next');
    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'vercel-pull-next',
      name: 'vercel-pull-next',
    });
    client.setArgv('pull', cwd);
    const exitCodePromise = pull(client);
    await expect(client.stderr).toOutput(
      'Downloading `development` Environment Variables for Project vercel-pull-next'
    );
    await expect(client.stderr).toOutput(
      `Created .vercel${path.sep}.env.development.local file`
    );
    await expect(client.stderr).toOutput(
      `Downloaded project settings to ${cwd}${path.sep}.vercel${path.sep}project.json`
    );
    await expect(exitCodePromise).resolves.toEqual(0);

    const rawDevEnv = await fs.readFile(
      path.join(cwd, '.vercel', '.env.development.local')
    );
    const devFileHasDevEnv = rawDevEnv.toString().includes('SPECIAL_FLAG');
    expect(devFileHasDevEnv).toBeTruthy();
  });

  it('should fail with message to pull without a link and without --env', async () => {
    client.stdin.isTTY = false;

    const cwd = setupUnitFixture('vercel-pull-unlinked');
    useUser();
    useTeams('team_dummy');

    client.setArgv('pull', cwd);
    const exitCodePromise = pull(client);
    await expect(client.stderr).toOutput(
      'Command `vercel pull` requires confirmation. Use option "--yes" to confirm.'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should fail without message to pull without a link and with --env', async () => {
    const cwd = setupUnitFixture('vercel-pull-next');
    useUser();
    useTeams('team_dummy');

    client.setArgv('pull', cwd, '--yes');
    const exitCodePromise = pull(client);
    await expect(client.stderr).not.toOutput(
      'Command `vercel pull` requires confirmation. Use option "--yes" to confirm.'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should handle pulling with env vars (headless mode)', async () => {
    try {
      process.env.VERCEL_PROJECT_ID = 'vercel-pull-next';
      process.env.VERCEL_ORG_ID = 'team_dummy';

      const cwd = setupUnitFixture('vercel-pull-next');

      // Remove the `.vercel` dir to ensure that the `pull`
      // command creates a new one based on env vars
      await fs.remove(path.join(cwd, '.vercel'));

      useUser();
      useTeams('team_dummy');
      useProject({
        ...defaultProject,
        id: 'vercel-pull-next',
        name: 'vercel-pull-next',
      });
      client.setArgv('pull', cwd);
      const exitCodePromise = pull(client);
      await expect(client.stderr).toOutput(
        'Downloading `development` Environment Variables for Project vercel-pull-next'
      );
      await expect(client.stderr).toOutput(
        `Created .vercel${path.sep}.env.development.local file`
      );
      await expect(client.stderr).toOutput(
        `Downloaded project settings to ${cwd}${path.sep}.vercel${path.sep}project.json`
      );
      await expect(exitCodePromise).resolves.toEqual(0);

      const config = await fs.readJSON(path.join(cwd, '.vercel/project.json'));
      expect(config).toMatchInlineSnapshot(`
        {
          "orgId": "team_dummy",
          "projectId": "vercel-pull-next",
          "settings": {
            "createdAt": 1555413045188,
          },
        }
      `);
    } finally {
      delete process.env.VERCEL_PROJECT_ID;
      delete process.env.VERCEL_ORG_ID;
    }
  });

  it('should handle --environment=preview flag', async () => {
    const cwd = setupUnitFixture('vercel-pull-next');
    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'vercel-pull-next',
      name: 'vercel-pull-next',
    });
    client.setArgv('pull', '--environment=preview', cwd);
    const exitCodePromise = pull(client);
    await expect(client.stderr).toOutput(
      'Downloading `preview` Environment Variables for Project vercel-pull-next'
    );
    await expect(client.stderr).toOutput(
      `Created .vercel${path.sep}.env.preview.local file`
    );
    await expect(client.stderr).toOutput(
      `Downloaded project settings to ${cwd}${path.sep}.vercel${path.sep}project.json`
    );
    await expect(exitCodePromise).resolves.toEqual(0);

    const rawPreviewEnv = await fs.readFile(
      path.join(cwd, '.vercel', '.env.preview.local')
    );
    const previewFileHasPreviewEnv = rawPreviewEnv
      .toString()
      .includes('REDIS_CONNECTION_STRING');
    expect(previewFileHasPreviewEnv).toBeTruthy();
  });

  it('should handle --environment=production flag', async () => {
    const cwd = setupUnitFixture('vercel-pull-next');
    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'vercel-pull-next',
      name: 'vercel-pull-next',
    });
    client.setArgv('pull', '--environment=production', cwd);
    const exitCodePromise = pull(client);
    await expect(client.stderr).toOutput(
      'Downloading `production` Environment Variables for Project vercel-pull-next'
    );
    await expect(client.stderr).toOutput(
      `Created .vercel${path.sep}.env.production.local file`
    );
    await expect(client.stderr).toOutput(
      `Downloaded project settings to ${cwd}${path.sep}.vercel${path.sep}project.json`
    );
    await expect(exitCodePromise).resolves.toEqual(0);

    const rawProdEnv = await fs.readFile(
      path.join(cwd, '.vercel', '.env.production.local')
    );
    const previewFileHasPreviewEnv1 = rawProdEnv
      .toString()
      .includes('REDIS_CONNECTION_STRING');
    expect(previewFileHasPreviewEnv1).toBeTruthy();
    const previewFileHasPreviewEnv2 = rawProdEnv
      .toString()
      .includes('SQL_CONNECTION_STRING');
    expect(previewFileHasPreviewEnv2).toBeTruthy();
  });

  it.each<'development' | 'preview' | 'production'>([
    'development',
    'preview',
    'production',
  ])(`should handle %s env vars with comments`, async envName => {
    const cwd = setupUnitFixture('vercel-pull-next');
    useUser();
    useTeams('team_dummy');
    useProject(
      {
        ...defaultProject,
        id: 'vercel-pull-next',
        name: 'vercel-pull-next',
      },
      [
        {
          type: 'encrypted',
          id: '781dt89g8r2h789g',
          key: 'REDIS_CONNECTION_STRING',
          value: 'redis://abc123@redis.example.com:6379',
          target: [envName],
          gitBranch: undefined,
          configurationId: null,
          updatedAt: 1557241361455,
          createdAt: 1557241361455,
          comment:
            'Connects to the Redis database that stores sessions for fast retrieval. This can be accessed on Vercel KV.',
        },
        {
          type: 'encrypted',
          id: '781dt89g8r2h789c',
          key: 'ANOTHER_ENV_STRING',
          value: 'A VALUE GOES HERE',
          target: [envName],
          gitBranch: undefined,
          configurationId: null,
          updatedAt: 1557241361455,
          createdAt: 1557241361455,
          comment: '',
        },
        {
          type: 'encrypted',
          id: '781dt89g8r2h789b',
          key: 'ANOTHER_ENV_STRING_2',
          value: 'A VALUE GOES HERE_2',
          target: [envName],
          gitBranch: undefined,
          configurationId: null,
          updatedAt: 1557241361455,
          createdAt: 1557241361455,
        },
        {
          type: 'encrypted',
          id: '781dt89g8r2h789a',
          key: 'DATABASE_URL',
          value: 'example.com',
          target: [envName],
          gitBranch: undefined,
          configurationId: null,
          updatedAt: 1557241361455,
          createdAt: 1557241361455,
          comment: 'This connects to postgres on vercel',
        },
      ]
    );
    client.setArgv('pull', `--environment=${envName}`, cwd);
    const exitCodePromise = pull(client);
    await expect(exitCodePromise).resolves.toEqual(0);

    const rawEnv = await fs.readFile(
      path.join(cwd, '.vercel', `.env.${envName}.local`)
    );

    expect(rawEnv.toString()).toMatchSnapshot();
  });

  it('should work with repo link', async () => {
    const cwd = setupUnitFixture('monorepo-link');
    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'QmbKpqpiUqbcke',
      name: 'dashboard',
      rootDirectory: 'dashboard',
    });
    client.cwd = path.join(cwd, 'dashboard');
    client.setArgv('pull');
    const exitCodePromise = pull(client);
    await expect(client.stderr).toOutput(
      'Downloading `development` Environment Variables for Project dashboard'
    );
    await expect(client.stderr).toOutput(
      `Created .vercel${path.sep}.env.development.local file`
    );
    await expect(client.stderr).toOutput(
      `Downloaded project settings to ${cwd}${path.sep}dashboard${path.sep}.vercel${path.sep}project.json`
    );
    await expect(exitCodePromise).resolves.toEqual(0);
  });
});

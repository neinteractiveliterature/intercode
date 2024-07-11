import { parseArgs } from 'util';
import { buildApp, buildServer } from './server';

export const CLI_OPTIONS = {
  port: {
    type: 'string',
    default: '3136',
  },
  backend: {
    type: 'string',
  },
  help: {
    type: 'boolean',
  },
  'ssl-key': {
    type: 'string',
  },
  'ssl-cert': {
    type: 'string',
  },
} as const;
export type CLIOptions = ReturnType<typeof parseArgs<{ options: typeof CLI_OPTIONS }>>;

export function runFromCli() {
  const args = parseArgs({
    options: CLI_OPTIONS,
  });

  if (args.values.help) {
    console.log(CLI_OPTIONS);
    process.exit(0);
  }

  if (!args.values.backend) {
    console.error('--backend is required');
    process.exit(1);
  }

  const port = Number.parseInt(args.values.port ?? '3136');

  const app = buildApp(args.values.backend);
  const server = buildServer(args, app);
  server.listen({ port }, () => {
    console.log(`Listening on port ${port}`);
  });
}

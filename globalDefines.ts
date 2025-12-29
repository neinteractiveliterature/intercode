import { execSync } from 'child_process';

export const globalDefines = {
  COMMIT_HASH: JSON.stringify(execSync('git rev-parse --short HEAD').toString()),
  'import.meta.env.INTERCODE_BACKEND': JSON.stringify(process.env.INTERCODE_BACKEND),
  'import.meta.env.INTERCODE_FRONTEND_UID': JSON.stringify(process.env.INTERCODE_FRONTEND_UID),
};

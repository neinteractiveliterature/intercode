import { execSync } from 'child_process';

export const globalDefines = {
  COMMIT_HASH: JSON.stringify(execSync('git rev-parse --short HEAD').toString()),
};

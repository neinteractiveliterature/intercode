import { execSync } from 'child_process';

// Docker builds don't have the .git directory, so they pass the revision in REVISION instead
function commitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch {
    return process.env.REVISION?.slice(0, 7) ?? 'unknown';
  }
}

export const globalDefines = {
  COMMIT_HASH: JSON.stringify(commitHash()),
};

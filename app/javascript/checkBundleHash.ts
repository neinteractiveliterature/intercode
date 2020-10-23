import { lazy, ComponentType } from 'react';

let bundleHash: string;

async function bundleHashMatches() {
  try {
    const response = await fetch('/bundle_hash');
    const newHash = await response.text();
    if (bundleHash == null) {
      bundleHash = newHash;
      return true;
    }

    return bundleHash === newHash;
  } catch (error) {
    // well, we tried
    return true;
  }
}

export async function reloadOnBundleHashMismatch() {
  const matches = await bundleHashMatches();
  if (!matches) {
    window.location.reload();
  }
}

export function checkBundleHashOnError<T>(func: () => Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    func()
      .then(resolve)
      .catch((error) => {
        bundleHashMatches().then((matches) => {
          if (!matches) {
            window.location.reload();
          } else {
            reject(error);
          }
        });
      });
  });
}

export function lazyWithBundleHashCheck(func: () => Promise<{ default: ComponentType<any> }>) {
  return lazy(() => checkBundleHashOnError(func));
}

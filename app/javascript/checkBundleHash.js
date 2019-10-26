import { lazy } from 'react';
import fetch from 'unfetch';

let bundleHash = null;

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

export function checkBundleHashOnError(func) {
  return new Promise((resolve, reject) => {
    func().then(resolve).catch((error) => {
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

export function lazyWithBundleHashCheck(func) {
  return lazy(() => checkBundleHashOnError(func));
}

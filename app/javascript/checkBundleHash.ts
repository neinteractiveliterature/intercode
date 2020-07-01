import { lazy } from 'react';
import fetch from 'unfetch';
import debouncePromise from 'debounce-promise';

let bundleHash: string | undefined;

const fetchBundleHash = () => fetch('/bundle_hash').then((response) => response.text());
const fetchBundleHashDebounced = debouncePromise(fetchBundleHash, 1000, { leading: true });

async function bundleHashMatches() {
  try {
    const newHash = await fetchBundleHashDebounced();
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
    func().then(resolve).catch((error: Error) => {
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

export function lazyWithBundleHashCheck<T extends React.ComponentType<any>>(
  func: () => Promise<{ default: T }>,
) {
  return lazy(() => checkBundleHashOnError(func));
}

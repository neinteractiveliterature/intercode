import { lazy, ComponentType } from 'react';

const HEADERS_TO_CHECK_FOR_MISMATCH = ['last-modified', 'etag', 'content-length'] as const;

let appEntrypointHeaders: Record<(typeof HEADERS_TO_CHECK_FOR_MISMATCH)[number], string | null> | undefined;

async function appEntrypointHeadersMatch() {
  try {
    const response = await fetch(`${__webpack_public_path__ ?? '/packs/'}application.js`, {
      method: 'HEAD',
      cache: 'no-store',
    });
    const newHeaders = HEADERS_TO_CHECK_FOR_MISMATCH.reduce(
      (acc, header) => ({ ...acc, [header]: response.headers.get(header) }),
      {} as Partial<typeof appEntrypointHeaders>,
    ) as NonNullable<typeof appEntrypointHeaders>;

    if (HEADERS_TO_CHECK_FOR_MISMATCH.every((header) => newHeaders[header] == null)) {
      // if the server isn't returning any usable headers, skip the check
      return true;
    }

    if (appEntrypointHeaders == null) {
      // this is the first load, since we have no headers yet
      appEntrypointHeaders = newHeaders;
      return true;
    }

    return HEADERS_TO_CHECK_FOR_MISMATCH.every(
      (header) => newHeaders[header] == null || (appEntrypointHeaders ?? {})[header] === newHeaders[header],
    );
  } catch {
    // well, we tried
    return true;
  }
}

export async function reloadOnAppEntrypointHeadersMismatch(): Promise<void> {
  const matches = await appEntrypointHeadersMatch();
  if (!matches) {
    window.location.reload();
  }
}

export function checkAppEntrypointHeadersOnError<T>(func: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    func()
      .then(resolve)
      .catch((error) => {
        appEntrypointHeadersMatch().then((matches) => {
          if (!matches) {
            window.location.reload();
          } else {
            reject(error);
          }
        });
      });
  });
}

export function lazyWithAppEntrypointHeadersCheck<Props>(
  func: () => Promise<{ default: ComponentType<Props> }>,
): React.LazyExoticComponent<ComponentType<Props>> {
  return lazy(() => checkAppEntrypointHeadersOnError(func));
}

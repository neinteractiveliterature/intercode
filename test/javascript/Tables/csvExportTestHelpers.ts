import { vi } from 'vitest';

import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';

// Lets a test click a table's "Export CSV" button and see what it asked the server for, without a server or a browser
// download.  Call `restore` (in afterEach) to put the globals back.
export function stubCsvDownload({ ok = true, status = 200, filename = 'export.csv' } = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    blob: async () => new Blob(['csv']),
    headers: new Headers({ 'Content-Disposition': `attachment; filename="${filename}"` }),
  });
  vi.stubGlobal('fetch', fetchMock);

  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  URL.createObjectURL = vi.fn(() => 'blob:test');
  URL.revokeObjectURL = vi.fn();

  const downloads: string[] = [];
  const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push(this.download);
  });

  return {
    /** the filenames the browser was asked to save */
    downloads,
    /** the URL and headers of the most recent request */
    lastRequest() {
      const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
      return { url: new URL(url as string), headers: (init as RequestInit).headers as Record<string, string> };
    },
    requestCount: () => fetchMock.mock.calls.length,
    restore() {
      vi.unstubAllGlobals();
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      clickSpy.mockRestore();
    },
  };
}

/** An authentication manager that always has a fresh access token, to wrap around a table for the export button. */
export function buildSignedInManager(token = 'test-token'): AuthenticationManager {
  const manager = new AuthenticationManager('test-client');
  vi.spyOn(manager, 'ensureFreshAccessToken').mockResolvedValue(token);
  return manager;
}

export { AuthenticationManagerContext };

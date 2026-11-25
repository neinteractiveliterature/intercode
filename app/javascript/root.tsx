import { LoaderFunctionArgs, Links, Meta, Scripts, ScrollRestoration } from 'react-router';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { ReactNode, useState } from 'react';
import Root, { loader } from './AppRootProviders';
import { SHELL_RECOVERY_SCRIPT } from './shellRecovery';
import BOOT_PRELOADS_SCRIPT from './bootPreloads.js?raw';

// The document shell, which framework mode prerenders into index.html
export function Layout({ children }: { children: ReactNode }) {
  // The prerendered default is replaced from /client_configuration (see bootPreloads.js) before React hydrates, so
  // hydrate with the title the document has by then; rendering the default would put it back. usePageTitle takes over
  // from there.
  // eslint-disable-next-line i18next/no-literal-string -- the default title
  const [title] = useState(() => (typeof document === 'undefined' ? 'Intercode' : document.title));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Runs before any of the shell's module scripts, to recover if one of them can't be loaded */}
        <script dangerouslySetInnerHTML={{ __html: SHELL_RECOVERY_SCRIPT }} />
        <title>{title}</title>
        {/* The requests the app makes at boot, started while its scripts are still downloading; its later fetch() calls
            reuse the responses. Rails-rendered shells do the same in layouts/_boot_preloads.html.erb. */}
        <link rel="preload" href="/client_configuration" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/authenticity_tokens" as="fetch" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: BOOT_PRELOADS_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// The same bootstrap data the data-mode root route uses; entry.client.tsx puts it in the router context
export const clientLoader = (args: LoaderFunctionArgs) => loader(args);
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  // The indicator only shows itself from an effect, which can't run until the app's scripts have loaded and it has
  // hydrated. The wrapper's class lets the stylesheet show it before then (see application.scss).
  return (
    <div className="boot-loading-indicator">
      <PageLoadingIndicator visible />
    </div>
  );
}

export default Root;

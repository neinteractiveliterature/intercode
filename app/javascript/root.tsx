import { LoaderFunctionArgs, Links, Meta, Scripts, ScrollRestoration } from 'react-router';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { ReactNode } from 'react';
import Root, { loader } from './AppRootProviders';
import { SHELL_RECOVERY_SCRIPT } from './shellRecovery';

// The document shell, which framework mode prerenders into index.html
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Runs before any of the shell's module scripts, to recover if one of them can't be loaded */}
        <script dangerouslySetInnerHTML={{ __html: SHELL_RECOVERY_SCRIPT }} />
        {/* eslint-disable-next-line i18next/no-literal-string -- the default title, replaced from /client_configuration */}
        <title>Intercode</title>
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
  return <PageLoadingIndicator visible />;
}

export default Root;

import { ProviderStack } from 'AppWrapper';
import { Links, LinksFunction, Meta, Scripts } from 'react-router';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import applicationStylesUrl from 'styles/application.scss?url';

export const errorElement = <RouteErrorBoundary />;

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: applicationStylesUrl }];

function RootProviderStack() {
  return (
    <ProviderStack
      authenticityTokens={{}}
      railsDefaultActiveStorageServiceName=""
      railsDirectUploadsUrl=""
      recaptchaSiteKey=""
      stripePublishableKey=""
    />
  );
}

export default function Root() {
  const client = useMemo(() => buildBrowserApolloClient(), []);

  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
      </head>
      <body>
        <ApolloProvider client={client}>
          <RootProviderStack />
        </ApolloProvider>
        <Scripts />
        {/* Disabling ScrollRestoration for now because it's breaking internal hash links in pages */}
        {/* <ScrollRestoration /> */}
      </body>
    </html>
  );
}

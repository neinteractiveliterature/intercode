import { ProviderStack } from 'AppWrapper';
import { Links, LinksFunction, Meta, Scripts } from 'react-router';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import applicationStylesUrl from 'styles/application.scss?url';
import { Route } from './+types/root';
import { ClientConfiguration } from 'graphqlTypes.generated';

export const errorElement = <RouteErrorBoundary />;

export async function loader({ context }: Route.LoaderArgs) {
  return context.clientConfigurationData;
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: applicationStylesUrl }];

function RootProviderStack({ clientConfiguration }: { clientConfiguration: ClientConfiguration }) {
  return (
    <ProviderStack
      railsDefaultActiveStorageServiceName={clientConfiguration.rails_default_active_storage_service_name}
      railsDirectUploadsUrl={clientConfiguration.rails_direct_uploads_url}
      recaptchaSiteKey={clientConfiguration.recaptcha_site_key}
    />
  );
}

export default function Root({ loaderData }: Route.ComponentProps) {
  const client = useMemo(() => buildBrowserApolloClient(), []);

  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
      </head>
      <body>
        <ApolloProvider client={client}>
          <RootProviderStack clientConfiguration={loaderData.clientConfiguration} />
        </ApolloProvider>
        <Scripts />
        {/* Disabling ScrollRestoration for now because it's breaking internal hash links in pages */}
        {/* <ScrollRestoration /> */}
      </body>
    </html>
  );
}

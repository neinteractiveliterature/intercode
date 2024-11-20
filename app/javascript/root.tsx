import { ProviderStack } from 'AppWrapper';
import { Links, LinksFunction, Meta, Scripts } from 'react-router';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';
import { AppRootContentQueryDocument } from 'appRootQueries.generated';
import { normalizePathForLayout } from 'AppRootLayout';
import { parseContent } from 'parsePageContent';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Route } from './+types/root';
import applicationStylesUrl from 'styles/application.scss?url';

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const client = context.client;
  const url = new URL(request.url);
  const { data } = await client.query({
    query: AppRootContentQueryDocument,
    variables: { domain: url.hostname, path: normalizePathForLayout(url.pathname) },
  });
  const contentHTML = data.cmsParentByDomain.effectiveCmsLayout.app_root_content;

  return { contentHTML };
};

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

const RootComponentMap = {
  AppRoot: RootProviderStack,
};

export default function Root({ loaderData: { contentHTML } }: Route.ComponentProps) {
  const content = useMemo(() => parseContent(contentHTML, RootComponentMap), [contentHTML]);
  const client = useMemo(() => buildBrowserApolloClient(), []);

  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
        {content.headComponents}
      </head>
      <body>
        <ApolloProvider client={client}>{content.bodyComponents}</ApolloProvider>
        <Scripts />
        {/* Disabling ScrollRestoration for now because it's breaking internal hash links in pages */}
        {/* <ScrollRestoration /> */}
      </body>
    </html>
  );
}

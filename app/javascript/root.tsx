import { ProviderStack } from 'AppWrapper';
import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import { LoaderFunction, useLoaderData } from 'react-router';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';
import { AppRootContentQueryDocument } from 'appRootQueries.generated';
import { normalizePathForLayout } from 'AppRootLayout';
import { parseContent } from 'parsePageContent';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { buildServerApolloClient } from 'serverApolloClient.server';

import('styles/application.scss');

type LoaderResult = {
  contentHTML: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const client = buildServerApolloClient(request);
  const url = new URL(request.url);
  const { data } = await client.query({
    query: AppRootContentQueryDocument,
    variables: { domain: url.hostname, path: normalizePathForLayout(url.pathname) },
  });
  const contentHTML = data.cmsParentByDomain.effectiveCmsLayout.app_root_content;

  return { contentHTML } satisfies LoaderResult;
};

export const errorElement = <RouteErrorBoundary />;

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

export default function Root() {
  const { contentHTML } = useLoaderData() as LoaderResult;
  const content = useMemo(() => parseContent(contentHTML, RootComponentMap), [contentHTML]);
  const client = useMemo(() => buildBrowserApolloClient(), []);

  return (
    <html lang="en">
      <head>
        {content.headComponents}
        <Links />
        <Meta />
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

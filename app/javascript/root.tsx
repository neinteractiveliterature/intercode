import { ProviderStack } from 'AppWrapper';
import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import { LoaderFunction, useLoaderData } from 'react-router';
import {
  buildIntercodeApolloClient,
  buildServerApolloHeaders,
  buildServerApolloLink,
  getClientURL,
} from 'useIntercodeApolloClient';
import { AppRootContentQueryDocument } from 'appRootQueries.generated';
import { normalizePathForLayout } from 'AppRootLayout';
import { parseContent } from 'parsePageContent';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';

import('styles/application.scss');

type LoaderResult = {
  contentHTML: string;
  clientHeaders: Record<string, string>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const clientHeaders = buildServerApolloHeaders(request);
  const client = buildIntercodeApolloClient(buildServerApolloLink(getClientURL(), clientHeaders), {
    ssrMode: true,
  });
  const url = new URL(request.url);
  const { data } = await client.query({
    query: AppRootContentQueryDocument,
    variables: { domain: url.hostname, path: normalizePathForLayout(url.pathname) },
  });
  const contentHTML = data.cmsParentByDomain.effectiveCmsLayout.app_root_content;

  return { contentHTML, clientHeaders } satisfies LoaderResult;
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
  const { contentHTML, clientHeaders } = useLoaderData() as LoaderResult;
  const content = useMemo(() => parseContent(contentHTML, RootComponentMap), [contentHTML]);
  const client = buildIntercodeApolloClient(buildServerApolloLink(getClientURL(), clientHeaders), {
    ssrMode: true,
  });

  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <head>
          {content.headComponents}
          <Links />
          <Meta />
        </head>
        <body>
          {content.bodyComponents}
          <Scripts />
          {/* Disabling ScrollRestoration for now because it's breaking internal hash links in pages */}
          {/* <ScrollRestoration /> */}
        </body>
      </html>
    </ApolloProvider>
  );
}

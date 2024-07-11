import { JSDOM } from 'jsdom';
import { parseDocument } from '../parsePageContent';
import { AppWrapperInnerProps } from '../AppWrapper';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import AuthenticityTokensContext, { useAuthenticityTokens } from '../AuthenticityTokensContext';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import AppShellContent from '../AppShellContent';
import { unwrappedComponents } from '../packs/components';

function parseDocumentWithJSDOM(html: string) {
  const dom = new JSDOM(html);
  // eslint-disable-next-line no-underscore-dangle
  return parseDocument(dom.window._document, unwrappedComponents, dom.window.Node, dom.window);
}

type AppShellProps = JSX.IntrinsicAttributes & {
  appRootContent: string;
  url: string;
  authenticityTokens: AppWrapperInnerProps['authenticityTokens'];
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

export default function AppShell({ appRootContent, url, authenticityTokens, apolloClient }: AppShellProps) {
  const authenticityTokensProviderValue = useAuthenticityTokens(authenticityTokens);

  return (
    <React.StrictMode>
      <StaticRouter basename="/" location={url}>
        <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
          <ApolloProvider client={apolloClient}>
            <AppShellContent appRootContent={appRootContent} parseDocument={parseDocumentWithJSDOM} />
          </ApolloProvider>
        </AuthenticityTokensContext.Provider>
      </StaticRouter>
    </React.StrictMode>
  );
}

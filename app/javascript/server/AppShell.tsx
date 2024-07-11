import { JSDOM } from 'jsdom';
import { ComponentMap, ContentParserContext, parseDocument } from '../parsePageContent';
import { AppWrapperInnerProps } from '../AppWrapper';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import AuthenticityTokensContext, { useAuthenticityTokens } from '../AuthenticityTokensContext';
import React, { useRef } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import AppShellContent from '../AppShellContent';
import { unwrappedComponents } from '../packs/components';
import { HelmetProvider } from 'react-helmet-async';

function parseDocumentWithJSDOM(html: string, componentMap: ComponentMap = unwrappedComponents) {
  const dom = new JSDOM(html);
  // eslint-disable-next-line no-underscore-dangle
  return parseDocument(dom.window._document, componentMap, dom.window.Node, dom.window);
}

type AppShellProps = JSX.IntrinsicAttributes & {
  appRootContent: string;
  url: string;
  authenticityTokens: AppWrapperInnerProps['authenticityTokens'];
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

export default function AppShell({ appRootContent, url, authenticityTokens, apolloClient }: AppShellProps) {
  const authenticityTokensProviderValue = useAuthenticityTokens(authenticityTokens);
  const helmetContext = useRef({});

  return (
    <React.StrictMode>
      <HelmetProvider context={helmetContext.current}>
        <StaticRouter basename="/" location={url}>
          <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
            <ApolloProvider client={apolloClient}>
              <ContentParserContext.Provider value={parseDocumentWithJSDOM}>
                <AppShellContent appRootContent={appRootContent} />
              </ContentParserContext.Provider>
            </ApolloProvider>
          </AuthenticityTokensContext.Provider>
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}

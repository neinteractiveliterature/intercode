import { ApolloLink, createHttpLink } from '@apollo/client';
import { buildIntercodeApolloClient, getClientURL } from 'useIntercodeApolloClient';
import nodeFetch from 'node-fetch';
import { clientOnly$, serverOnly$ } from 'vite-env-only/macros';

const isomorphicFetch = serverOnly$(nodeFetch) ?? clientOnly$(fetch) ?? fetch;

export function buildServerApolloLink(uri: URL, headers: Record<string, string>): ApolloLink {
  return createHttpLink({
    uri: uri.toString(),
    credentials: 'same-origin',
    headers,
    // host header setting doesn't work with the default fetch implementation
    fetch: isomorphicFetch as typeof fetch,
  });
}

export function buildServerApolloHeaders(req: Request) {
  return {
    cookie: req.headers.get('cookie') ?? '',
    host: new URL(req.url).hostname,
    'user-agent': 'IntercodeBFF/1.0',
  };
}

export function buildServerApolloClient(req: Request) {
  return buildIntercodeApolloClient(buildServerApolloLink(getClientURL(), buildServerApolloHeaders(req)), {
    ssrMode: true,
  });
}

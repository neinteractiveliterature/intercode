import { ApolloLink } from '@apollo/client';
import { buildIntercodeApolloClient, buildTerminatingApolloLink, getClientURL } from 'useIntercodeApolloClient';
import nodeFetch from 'node-fetch';

export function buildServerApolloLink(uri: URL, headers: Record<string, string>): ApolloLink {
  return buildTerminatingApolloLink({
    uri: uri.toString(),
    credentials: 'same-origin',
    headers,
    // host header setting doesn't work with the default fetch implementation
    fetch: nodeFetch as unknown as typeof fetch,
  });
}

export type BuildServerApolloClientOptions = { cookie: string | undefined; hostname: string };

export function buildServerApolloHeaders({ cookie, hostname }: BuildServerApolloClientOptions) {
  return {
    cookie: cookie ?? '',
    host: hostname,
    'user-agent': 'IntercodeBFF/1.0',
  };
}

export function buildServerApolloClient(options: BuildServerApolloClientOptions) {
  return buildIntercodeApolloClient(buildServerApolloLink(getClientURL(), buildServerApolloHeaders(options)), {
    ssrMode: true,
  });
}

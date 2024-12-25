import { ApolloLink, InMemoryCache } from '@apollo/client';
import {
  buildAuthHeadersLink,
  buildIntercodeApolloCache,
  buildIntercodeApolloClient,
  buildTerminatingApolloLink,
  getClientURL,
} from 'useIntercodeApolloClient';
import nodeFetch from 'node-fetch';
import { Session } from 'react-router';
import { getSessionUuid, SessionData, SessionFlashData } from 'sessions';
import AuthenticityTokensManager from 'AuthenticityTokensContext';
import QuickLRU from 'quick-lru';
import { parseIntOrNull } from '@neinteractiveliterature/litform';
import sizeof from 'object-sizeof';
import { filesize } from 'filesize';

declare module '@apollo/client' {
  interface DefaultContext {
    authenticityTokensManager: AuthenticityTokensManager;
  }
}

export function buildServerApolloLink(
  uri: URL,
  headers: Record<string, string>,
  authenticityTokensManager: AuthenticityTokensManager,
): ApolloLink {
  return buildAuthHeadersLink(authenticityTokensManager).concat(
    buildTerminatingApolloLink({
      uri: uri.toString(),
      credentials: 'same-origin',
      headers,
      // host header setting doesn't work with the default fetch implementation
      fetch: nodeFetch as unknown as typeof fetch,
    }),
  );
}

export type BuildServerApolloClientOptions = {
  session: Session<SessionData, SessionFlashData>;
  authenticityTokensManager: AuthenticityTokensManager;
  cookie: string | undefined;
  hostname: string | undefined;
};

export function buildServerApolloHeaders({ cookie, hostname }: BuildServerApolloClientOptions) {
  return {
    ...(cookie ? { cookie } : {}),
    ...(hostname ? { host: hostname } : {}),
    'user-agent': 'IntercodeBFF/1.0',
  };
}

const sessionCaches = new QuickLRU<string, InMemoryCache>({
  maxSize: parseIntOrNull(process.env.INTERCODE_MAX_SESSIONS ?? '') ?? 50,
});

function getSessionCache(uuid: string) {
  const existing = sessionCaches.get(uuid);

  if (existing) {
    return existing;
  } else {
    const cache = buildIntercodeApolloCache();
    sessionCaches.set(uuid, cache);
    return cache;
  }
}

function getCacheSize(cache: InMemoryCache) {
  // @ts-expect-error We're accessing a private property of InMemoryCache
  return sizeof(cache.data.data);
}

export async function buildServerApolloClient(options: BuildServerApolloClientOptions) {
  const session = options.session;
  const cache = getSessionCache(await getSessionUuid(session));

  console.log(`Cache size: ${filesize(getCacheSize(cache))}`);

  return buildIntercodeApolloClient(
    buildServerApolloLink(getClientURL(), buildServerApolloHeaders(options), options.authenticityTokensManager),
    {
      ssrMode: true,
      cache,
    },
  );
}

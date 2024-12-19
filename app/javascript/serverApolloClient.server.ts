import { ApolloLink, InMemoryCache } from '@apollo/client';
import {
  buildIntercodeApolloCache,
  buildIntercodeApolloClient,
  buildTerminatingApolloLink,
  getClientURL,
} from 'useIntercodeApolloClient';
import nodeFetch from 'node-fetch';
import { setContext } from '@apollo/client/link/context';
import { Session } from 'react-router';
import { commitSession, getSession, SessionData, SessionFlashData } from 'sessions';
import { fetchAuthenticityTokens, getAuthenticityTokensURL } from 'AuthenticityTokensContext';
import { v4 } from 'uuid';
import QuickLRU from 'quick-lru';
import { parseIntOrNull } from '@neinteractiveliterature/litform';
import sizeof from 'object-sizeof';
import { filesize } from 'filesize';

declare module '@apollo/client' {
  interface DefaultContext {
    session?: Session<SessionData, SessionFlashData>;
  }
}

function buildServerSessionLink(session: Session, cookie: string, setCookie: (value: string) => void) {
  return setContext(async (operation, prevContext) => {
    if (!session.data.csrfToken) {
      const authenticityTokensUrl = getAuthenticityTokensURL();
      const tokens = await fetchAuthenticityTokens(authenticityTokensUrl, { cookie });
      if (tokens.graphql) {
        session.set('csrfToken', tokens.graphql);
      }
      setCookie(await commitSession(session));
    }

    return {
      ...prevContext,
      session,
      credentials: 'same-origin',
      headers: {
        'X-CSRF-Token': session.data.csrfToken,
      },
    };
  });
}

export function buildServerApolloLink(
  uri: URL,
  headers: Record<string, string>,
  session: Session,
  setCookie: (value: string) => void,
): ApolloLink {
  return buildServerSessionLink(session, headers.cookie, setCookie).concat(
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
  cookie: string | undefined;
  hostname: string;
  setCookie: (value: string) => void;
};

export function buildServerApolloHeaders({ cookie, hostname }: BuildServerApolloClientOptions) {
  return {
    cookie: cookie ?? '',
    host: hostname,
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
  const session = await getSession(options.cookie);
  const uuid = session.data.uuid ?? v4();
  const cache = getSessionCache(uuid);

  console.log(`Cache size: ${filesize(getCacheSize(cache))}`);

  if (!session.data.uuid) {
    session.set('uuid', uuid);
    options.setCookie(await commitSession(session));
  }

  return buildIntercodeApolloClient(
    buildServerApolloLink(getClientURL(), buildServerApolloHeaders(options), session, options.setCookie),
    {
      ssrMode: true,
      cache,
    },
  );
}

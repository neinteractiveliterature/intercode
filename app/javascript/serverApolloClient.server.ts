import { ApolloLink } from '@apollo/client';
import { buildIntercodeApolloClient, buildTerminatingApolloLink, getClientURL } from 'useIntercodeApolloClient';
import nodeFetch from 'node-fetch';
import { setContext } from '@apollo/client/link/context';
import { Session } from 'react-router';
import { commitSession, getSession, SessionData, SessionFlashData } from 'sessions';
import { fetchAuthenticityTokens, getAuthenticityTokensURL } from 'AuthenticityTokensContext';

declare module '@apollo/client' {
  interface DefaultContext {
    session?: Session<SessionData, SessionFlashData>;
  }
}

function buildServerSessionLink(cookie: string, setCookie: (value: string) => void) {
  return setContext(async (operation, prevContext) => {
    const session = prevContext.session ?? (await getSession(cookie));

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
  setCookie: (value: string) => void,
): ApolloLink {
  return buildServerSessionLink(headers.cookie, setCookie).concat(
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

export function buildServerApolloClient(options: BuildServerApolloClientOptions) {
  return buildIntercodeApolloClient(
    buildServerApolloLink(getClientURL(), buildServerApolloHeaders(options), options.setCookie),
    {
      ssrMode: true,
    },
  );
}

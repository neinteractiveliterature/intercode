import { vi } from 'vitest';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { parse } from 'graphql';
import { Observable } from 'rxjs';

import AuthenticityTokensManager from '../../app/javascript/AuthenticityTokensContext';
import { AuthenticationManager } from '../../app/javascript/Authentication/authenticationManager';
import {
  buildAuthHeadersLink,
  buildBrowserApolloClient,
  buildClientApolloLink,
  ErrorHandlerLink,
  getClientURL,
  getIntercodeUserTimezoneHeader,
  GraphQLNotAuthenticatedErrorEvent,
} from '../../app/javascript/useIntercodeApolloClient';

const query = parse('query TestQuery { hello }');
const uploadMutation = parse('mutation TestUpload($file: Upload!) { upload(file: $file) }');

type FetchCall = { url: string; init: RequestInit; headers: Headers };

describe('the Intercode Apollo links', () => {
  let fetchCalls: FetchCall[];
  let responder: (call: FetchCall, callNumber: number) => Response;
  let tokensManager: AuthenticityTokensManager;

  const jsonResponse = (body: unknown, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } });
  const helloResponse = (headers: Record<string, string> = {}) => jsonResponse([{ data: { hello: 'world' } }], headers);

  const buildManager = (tokens: string[]) => {
    const manager = new AuthenticationManager('client-id');
    // A stand-in for the real thing that hands out the given access tokens in order, whenever there's none in hand
    const ensureFreshAccessToken = vi.fn(async () => {
      if (!manager.jwtToken) {
        manager.jwtToken = tokens.shift();
      }
      return manager.jwtToken;
    });
    manager.ensureFreshAccessToken = ensureFreshAccessToken;
    return { manager, ensureFreshAccessToken };
  };

  const execute = (link: ApolloLink) =>
    new ApolloClient({ link, cache: new InMemoryCache() }).query({ query, fetchPolicy: 'no-cache' });

  const authorizationHeaders = () => fetchCalls.map((call) => call.headers.get('Authorization'));

  beforeEach(() => {
    fetchCalls = [];
    responder = () => helloResponse();
    tokensManager = new AuthenticityTokensManager(fetch, { graphql: 'csrf-token' }, new URL('http://localhost/'));
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        const call = { url: String(url), init, headers: new Headers(init.headers) };
        fetchCalls.push(call);
        return responder(call, fetchCalls.length);
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getIntercodeUserTimezoneHeader', () => {
    it('sends the browser’s timezone name', () => {
      expect(getIntercodeUserTimezoneHeader()).toEqual({
        'X-Intercode-User-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    });
  });

  describe('getClientURL', () => {
    it('points at /graphql on the current origin', () => {
      expect(getClientURL().toString()).toBe(`${window.location.origin}/graphql`);
    });
  });

  describe('buildAuthHeadersLink', () => {
    const run = async (authenticationManager?: AuthenticationManager) => {
      const seen: Record<string, unknown>[] = [];
      const capture = new ApolloLink((operation) => {
        seen.push(operation.getContext());
        return new Observable((observer) => {
          observer.next({ data: { hello: 'world' } });
          observer.complete();
        });
      });
      await execute(ApolloLink.from([buildAuthHeadersLink(tokensManager, authenticationManager), capture]));
      return seen[0] as { headers: Record<string, string | undefined>; credentials?: string };
    };

    it('sends a bearer token when there is one', async () => {
      const { manager } = buildManager(['access-token']);

      const context = await run(manager);

      expect(context.headers.Authorization).toBe('Bearer access-token');
      expect(context.headers['X-CSRF-Token']).toBeUndefined();
    });

    it('falls back to the CSRF token and cookie credentials when there is no access token', async () => {
      const { manager } = buildManager([]);

      const context = await run(manager);

      expect(context.headers.Authorization).toBeUndefined();
      expect(context.headers['X-CSRF-Token']).toBe('csrf-token');
      expect(context.credentials).toBe('same-origin');
    });

    it('uses the CSRF token when there is no authentication manager at all', async () => {
      const context = await run();

      expect(context.headers['X-CSRF-Token']).toBe('csrf-token');
    });

    it('picks up CSRF tokens that arrive later', async () => {
      tokensManager.tokens = { graphql: 'a-newer-token' };

      const context = await run();

      expect(context.headers['X-CSRF-Token']).toBe('a-newer-token');
    });
  });

  describe('ErrorHandlerLink', () => {
    const failWith = (errors: { message: string; extensions?: Record<string, unknown> }[]) =>
      execute(
        ApolloLink.from([
          ErrorHandlerLink,
          new ApolloLink(
            () =>
              new Observable((observer) => {
                observer.next({ data: null, errors });
                observer.complete();
              }),
          ),
        ]),
      ).catch(() => undefined);

    let events: GraphQLNotAuthenticatedErrorEvent[];
    const listener = (event: Event) => events.push(event as GraphQLNotAuthenticatedErrorEvent);

    beforeEach(() => {
      events = [];
      window.addEventListener(GraphQLNotAuthenticatedErrorEvent.type, listener);
    });

    afterEach(() => {
      window.removeEventListener(GraphQLNotAuthenticatedErrorEvent.type, listener);
    });

    it('announces NOT_AUTHENTICATED errors on the window', async () => {
      await failWith([{ message: 'Not logged in', extensions: { code: 'NOT_AUTHENTICATED' } }]);

      expect(events).toHaveLength(1);
      expect(events[0].error.message).toBe('Not logged in');
    });

    it('announces each NOT_AUTHENTICATED error', async () => {
      await failWith([
        { message: 'one', extensions: { code: 'NOT_AUTHENTICATED' } },
        { message: 'two', extensions: { code: 'NOT_AUTHENTICATED' } },
      ]);

      expect(events.map((event) => event.error.message)).toEqual(['one', 'two']);
    });

    it('ignores other errors', async () => {
      await failWith([{ message: 'Nope', extensions: { code: 'NOT_AUTHORIZED' } }, { message: 'No extensions' }]);

      expect(events).toEqual([]);
    });
  });

  describe('buildClientApolloLink', () => {
    it('posts to the GraphQL URL with the timezone header and CSRF token', async () => {
      const link = buildClientApolloLink(new URL('http://localhost/graphql'), tokensManager);

      const result = await execute(link);

      expect(result.data).toEqual({ hello: 'world' });
      expect(fetchCalls).toHaveLength(1);
      expect(fetchCalls[0].url).toBe('http://localhost/graphql');
      expect(fetchCalls[0].headers.get('X-Intercode-User-Timezone')).toBe(
        getIntercodeUserTimezoneHeader()['X-Intercode-User-Timezone'],
      );
      expect(fetchCalls[0].headers.get('X-CSRF-Token')).toBe('csrf-token');
    });

    it('sends the bearer token when authenticated', async () => {
      const { manager } = buildManager(['access-token']);

      await execute(buildClientApolloLink(new URL('http://localhost/graphql'), tokensManager, manager));

      expect(authorizationHeaders()).toEqual(['Bearer access-token']);
    });

    it('sends operations containing files as multipart uploads', async () => {
      responder = () => jsonResponse({ data: { upload: true } });
      const link = buildClientApolloLink(new URL('http://localhost/graphql'), tokensManager);
      const client = new ApolloClient({ link, cache: new InMemoryCache() });

      await client.mutate({
        mutation: uploadMutation,
        variables: { file: new File(['contents'], 'hello.txt', { type: 'text/plain' }) },
      });

      expect(fetchCalls[0].init.body).toBeInstanceOf(FormData);
    });

    it('sends operations containing files nested in the variables as multipart uploads', async () => {
      responder = () => jsonResponse({ data: { upload: true } });
      const link = buildClientApolloLink(new URL('http://localhost/graphql'), tokensManager);
      const client = new ApolloClient({ link, cache: new InMemoryCache() });

      await client.mutate({
        mutation: uploadMutation,
        variables: { file: { nested: [new Blob(['contents'])] } },
      });

      expect(fetchCalls[0].init.body).toBeInstanceOf(FormData);
    });

    it('sends operations without files as JSON', async () => {
      await execute(buildClientApolloLink(new URL('http://localhost/graphql'), tokensManager));

      expect(typeof fetchCalls[0].init.body).toBe('string');
    });
  });

  describe('refreshing after the server rejects the bearer token', () => {
    const rejected = () => helloResponse({ 'X-Bearer-Token-Rejected': 'true' });
    const buildLink = (manager?: AuthenticationManager) =>
      buildClientApolloLink(new URL('http://localhost/graphql'), tokensManager, manager);

    it('gets a fresh access token and retries the request once', async () => {
      const { manager } = buildManager(['stale-token', 'fresh-token']);
      responder = (_call, callNumber) => (callNumber === 1 ? rejected() : helloResponse());

      const result = await execute(buildLink(manager));

      expect(result.data).toEqual({ hello: 'world' });
      expect(authorizationHeaders()).toEqual(['Bearer stale-token', 'Bearer fresh-token']);
    });

    it('does not retry a second time if the fresh token is rejected too', async () => {
      const { manager } = buildManager(['stale-token', 'fresh-token']);
      responder = () => rejected();

      await execute(buildLink(manager));

      expect(fetchCalls).toHaveLength(2);
    });

    it('does not refresh when the bearer token was accepted', async () => {
      const { manager, ensureFreshAccessToken } = buildManager(['good-token']);

      await execute(buildLink(manager));

      expect(fetchCalls).toHaveLength(1);
      expect(ensureFreshAccessToken).toHaveBeenCalledTimes(1);
    });

    it('returns the original response if there is no way to get a fresh token', async () => {
      const { manager } = buildManager(['stale-token']);
      responder = () => rejected();

      const result = await execute(buildLink(manager));

      expect(result.data).toEqual({ hello: 'world' });
      // (no retry, since there was nothing new to retry with)
      expect(fetchCalls).toHaveLength(1);
    });

    it('returns the original response if refreshing throws', async () => {
      const { manager, ensureFreshAccessToken } = buildManager(['stale-token']);
      responder = () => rejected();
      ensureFreshAccessToken.mockResolvedValueOnce('stale-token').mockRejectedValueOnce(new Error('network down'));

      const result = await execute(buildLink(manager));

      expect(result.data).toEqual({ hello: 'world' });
      expect(fetchCalls).toHaveLength(1);
    });

    it('does nothing special without an authentication manager', async () => {
      responder = () => rejected();

      const result = await execute(buildLink());

      expect(result.data).toEqual({ hello: 'world' });
      expect(fetchCalls).toHaveLength(1);
    });
  });

  describe('buildBrowserApolloClient', () => {
    it('builds a client that talks to the backend', async () => {
      const client = buildBrowserApolloClient(tokensManager);

      const result = await client.query({ query });

      expect(result.data).toEqual({ hello: 'world' });
      expect(fetchCalls[0].url).toBe(`${window.location.origin}/graphql`);
    });
  });
});

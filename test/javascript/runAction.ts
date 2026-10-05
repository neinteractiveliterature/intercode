import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { ActionFunction, RouterContextProvider } from 'react-router';

import { apolloClientContext } from '../../app/javascript/AppContexts';

export type RunActionOptions = {
  method: string;
  params?: Record<string, string>;
  // JSON-encoded, or sent as form data
  json?: unknown;
  form?: Record<string, string>;
  apolloMocks?: MockLink.MockedResponse[];
};

// Runs a React Router action on its own, against a real Apollo client on a MockLink, and returns what it returned.
// For routes whose action is the interesting part (what mutation it sends, what it does with the result), this is
// quicker and more direct than rendering a page that submits to it.  See agent-docs/frontend-testing.md.
export default async function runAction(
  action: ActionFunction<RouterContextProvider>,
  { method, params = {}, json, form, apolloMocks = [] }: RunActionOptions,
) {
  const cache = new InMemoryCache();
  const client = new ApolloClient({ cache, link: new MockLink(apolloMocks) });
  const resetStore = vi.spyOn(client, 'resetStore');
  const context = new RouterContextProvider();
  context.set(apolloClientContext, client);

  let body: BodyInit | undefined;
  if (json !== undefined) {
    body = JSON.stringify(json);
  } else if (form) {
    body = new URLSearchParams(form);
  }

  const request = new Request('http://localhost/action', { method, body });
  const result = await action({ context, params, request } as Parameters<typeof action>[0]);

  return { result, client, cache, resetStore };
}

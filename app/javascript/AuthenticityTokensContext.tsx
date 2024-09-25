import { getBackendBaseUrl } from 'getBackendBaseUrl';
import { createContext } from 'react';

export type AuthenticityTokens = {
  graphql?: string;
  changePassword?: string;
  denyAuthorization?: string;
  grantAuthorization?: string;
  railsDirectUploads?: string;
  resetPassword?: string;
  signIn?: string;
  signOut?: string;
  signUp?: string;
  updateUser?: string;
};

export default class AuthenticityTokensManager {
  tokens?: AuthenticityTokens;
  url: URL;
  fetcher: typeof fetch;

  constructor(fetcher: typeof fetch, tokens: AuthenticityTokens | undefined, url: URL) {
    this.tokens = tokens;
    this.url = url;
    this.fetcher = fetcher;
  }

  setTokens(tokens: AuthenticityTokens) {
    // perform a shallow comparison to avoid breaking object equality if we get the same tokens
    // back from the server
    const prevTokens = { ...this.tokens };
    const newTokens = { ...prevTokens, ...tokens };

    if (
      Object.keys(newTokens).length === Object.keys(prevTokens ?? {}).length &&
      Object.keys(prevTokens).every((key: keyof typeof prevTokens) => newTokens[key] !== prevTokens[key])
    ) {
      return;
    }

    this.tokens = newTokens;
  }

  async refresh() {
    const response = await fetchAuthenticityTokens(this.fetcher, this.url);
    const json = await response.json();

    this.setTokens(json);
    return this.tokens!;
  }

  async getTokens() {
    if (this.tokens) {
      return this.tokens;
    }

    return await this.refresh();
  }
}

export async function fetchAuthenticityTokens(
  fetcher: typeof fetch,
  url: URL,
  headers?: HeadersInit,
): Promise<Response> {
  const response = await fetcher(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  });

  return response;
}

export function getAuthenticityTokensURL(): URL {
  return new URL('/authenticity_tokens', getBackendBaseUrl());
}

export const AuthenticityTokensContext = createContext<AuthenticityTokensManager>(
  new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL()),
);

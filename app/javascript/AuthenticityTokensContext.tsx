import { getBackendBaseUrl } from 'getBackendBaseUrl';
import { createContext, useRef } from 'react';

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

  constructor(tokens: AuthenticityTokens | undefined, url: URL) {
    this.tokens = tokens;
    this.url = url;
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
    const json = await fetchAuthenticityTokens(this.url);

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

export async function fetchAuthenticityTokens(url: URL, headers?: HeadersInit): Promise<AuthenticityTokens> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  });

  const json = await response.json();
  return json;
}

export function getAuthenticityTokensURL(): URL {
  return new URL('/authenticity_tokens', getBackendBaseUrl());
}

export const AuthenticityTokensContext = createContext<AuthenticityTokensManager>(
  new AuthenticityTokensManager(undefined, getAuthenticityTokensURL()),
);

export function useInitializeAuthenticityTokensManager(initialTokens?: AuthenticityTokens) {
  const manager = useRef(new AuthenticityTokensManager(initialTokens, getAuthenticityTokensURL()));
  return manager.current;
}

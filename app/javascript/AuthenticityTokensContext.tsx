import { useEffect, useRef } from 'react';

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
  static instance: AuthenticityTokensManager;

  tokens: AuthenticityTokens;
  url: URL;

  constructor(tokens: AuthenticityTokens, url: URL) {
    if (AuthenticityTokensManager.instance) {
      throw new Error(
        "Please don't initialize AuthenticityTokensManager directly, instead use AuthenticityTokensManager.instance",
      );
    }

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
    const response = await fetch(this.url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await response.json();

    this.setTokens(json);
    return this.tokens;
  }
}

function getURL(): URL {
  if (typeof window !== 'undefined') {
    return new URL('/authenticity_tokens', window.location.href);
  } else {
    return new URL('/authenticity_tokens', process.env.INTERCODE_BACKEND);
  }
}

AuthenticityTokensManager.instance = new AuthenticityTokensManager({}, getURL());

export function useInitializeAuthenticityTokens(initialTokens: AuthenticityTokens) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      AuthenticityTokensManager.instance.setTokens(initialTokens);
      AuthenticityTokensManager.instance.refresh();
      initializedRef.current = true;
    }
  }, [initialTokens]);
}

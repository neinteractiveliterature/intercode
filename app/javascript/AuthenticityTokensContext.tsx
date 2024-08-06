import { createContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';

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

  constructor(tokens: AuthenticityTokens) {
    if (AuthenticityTokensManager.instance) {
      throw new Error(
        "Please don't initialize AuthenticityTokensManager directly, instead use AuthenticityTokensManager.instance",
      );
    }

    this.tokens = tokens;
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
    const response = await fetch('/authenticity_tokens', {
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

AuthenticityTokensManager.instance = new AuthenticityTokensManager({});

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

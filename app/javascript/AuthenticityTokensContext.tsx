import { createContext, useState, useCallback, useMemo } from 'react';
import isEqual from 'lodash/isEqual';

export type AuthenticityTokensContextValue = {
  refresh: () => Promise<void>;
  graphql: string;
  changePassword?: string;
  denyAuthorization?: string;
  grantAuthorization?: string;
  resetPassword?: string;
  signIn?: string;
  signOut?: string;
  signUp?: string;
  updateUser?: string;
};

const AuthenticityTokensContext = createContext<AuthenticityTokensContextValue>({
  refresh: () => Promise.resolve(),
  graphql: 'fakeAuthenticityToken',
});

export function useAuthenticityTokens(
  initialTokens: Omit<AuthenticityTokensContextValue, 'refresh'>,
): AuthenticityTokensContextValue {
  const [tokens, setTokens] = useState(initialTokens);

  const refresh = useCallback(async () => {
    const response = await fetch('/authenticity_tokens', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await response.json();
    setTokens((prevTokens) => {
      // perform a deep comparison to avoid breaking object equality if we get the same tokens
      // back from the server
      const newTokens = { ...prevTokens, ...json };
      if (!isEqual(newTokens, prevTokens)) {
        return newTokens;
      }

      return prevTokens;
    });
  }, []);

  const value = useMemo(() => ({ ...tokens, refresh }), [refresh, tokens]);

  return value;
}

export default AuthenticityTokensContext;

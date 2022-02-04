import { createContext, useState, useCallback, useMemo, useEffect } from 'react';

export type AuthenticityTokensContextValue = {
  refresh: () => Promise<void>;
  graphql: string;
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
      // perform a shallow comparison to avoid breaking object equality if we get the same tokens
      // back from the server
      const newTokens = { ...prevTokens, ...json };
      if (Object.keys(newTokens).length !== Object.keys(prevTokens ?? {}).length) {
        return newTokens;
      }

      if (Object.keys(prevTokens).every((key: keyof typeof prevTokens) => newTokens[key] !== prevTokens[key])) {
        return prevTokens;
      }

      return newTokens;
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ ...tokens, refresh }), [refresh, tokens]);

  return value;
}

export default AuthenticityTokensContext;

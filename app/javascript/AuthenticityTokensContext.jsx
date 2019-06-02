import React, { useState, useCallback, useMemo } from 'react';
import fetch from 'unfetch';

const AuthenticityTokensContext = React.createContext({});

export function useAuthenticityTokens(initialTokens) {
  const [tokens, setTokens] = useState(initialTokens);

  const refresh = useCallback(
    async () => {
      const response = await fetch('/authenticity_tokens', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      const json = await response.json();
      setTokens(prevTokens => ({ ...prevTokens, ...json }));
    },
    [],
  );

  const value = useMemo(
    () => ({ ...tokens, refresh }),
    [refresh, tokens],
  );

  return value;
}

export default AuthenticityTokensContext;

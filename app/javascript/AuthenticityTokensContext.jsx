import React, { useState, useCallback, useMemo } from 'react';
import fetch from 'unfetch';
import isEqual from 'lodash/isEqual';

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
      setTokens((prevTokens) => {
        // perform a deep comparison to avoid breaking object equality if we get the same tokens
        // back from the server
        const newTokens = ({ ...prevTokens, ...json });
        if (!isEqual(newTokens, prevTokens)) {
          return newTokens;
        }

        return prevTokens;
      });
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

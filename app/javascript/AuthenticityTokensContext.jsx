import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import fetch from 'unfetch';

const AuthenticityTokensContext = React.createContext({});

export function AuthenticityTokensContextProvider({ tokens, children }) {
  const [value, setValue] = useState(tokens);

  const refresh = useCallback(
    async () => {
      const response = await fetch('/authenticity_tokens', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      const json = await response.json();
      setValue(prevValue => ({ ...prevValue, ...json }));
    },
    [],
  );

  return (
    <AuthenticityTokensContext.Provider value={{ ...value, refresh }}>
      {children}
    </AuthenticityTokensContext.Provider>
  );
}

AuthenticityTokensContextProvider.propTypes = {
  tokens: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthenticityTokensContext;

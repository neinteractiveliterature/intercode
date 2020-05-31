import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import fetch from 'unfetch';
import { useHistory } from 'react-router-dom';

import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useAfterSessionChange from './useAfterSessionChange';

async function signOut(authenticityToken) {
  const response = await fetch('/users/sign_out', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      // Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(responseJson.error);
  }
}

function SignOutButton({ className, caption }) {
  const history = useHistory();
  const { signOut: authenticityToken } = useContext(AuthenticityTokensContext);
  const afterSessionChange = useAfterSessionChange(history);

  const onClick = async (event) => {
    event.preventDefault();
    await signOut(authenticityToken);
    await afterSessionChange('/');
  };

  return (
    <button className={className} type="button" onClick={onClick}>
      {caption}
    </button>
  );
}

SignOutButton.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.node,
};

SignOutButton.defaultProps = {
  className: 'btn btn-link',
  caption: 'Log out',
};

export default SignOutButton;

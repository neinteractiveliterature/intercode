import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import fetch from 'unfetch';
import AuthenticityTokensContext from '../AuthenticityTokensContext';

async function signOut(authenticityToken) {
  const response = await fetch('/users/sign_out', {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(responseJson.error);
  }
}

function SignOutButton({ className, caption }) {
  const authenticityToken = useContext(AuthenticityTokensContext).signOut;

  const onClick = async (event) => {
    event.preventDefault();
    await signOut(authenticityToken);
    window.location.reload();
  };

  return (
    <button className={className} type="button" onClick={onClick}>
      {caption}
    </button>
  );
}

SignOutButton.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.string,
};

SignOutButton.defaultProps = {
  className: 'btn btn-link',
  caption: 'Log out',
};

export default SignOutButton;

import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import AuthenticationModalContext from './AuthenticationModalContext';

function SignInButton({ className, caption }) {
  const { open } = useContext(AuthenticationModalContext);

  return (
    <button className={className} type="button" onClick={() => open({ currentView: 'signIn' })}>
      {caption}
    </button>
  );
}

SignInButton.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.node,
};

SignInButton.defaultProps = {
  className: 'btn btn-link',
  caption: 'Log in',
};

export default SignInButton;

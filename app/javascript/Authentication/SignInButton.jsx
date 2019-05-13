import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import AuthenticationModalContext from './AuthenticationModalContext';

function SignInButton({ className, caption, initiallyOpen }) {
  const { open } = useContext(AuthenticationModalContext);
  useEffect(
    () => {
      if (initiallyOpen) {
        open({ currentView: 'signIn' });
      }
    },
    [initiallyOpen, open],
  );

  return (
    <button className={className} type="button" onClick={() => open({ currentView: 'signIn' })}>
      {caption}
    </button>
  );
}

SignInButton.propTypes = {
  initiallyOpen: PropTypes.bool,
  className: PropTypes.string,
  caption: PropTypes.node,
};

SignInButton.defaultProps = {
  initiallyOpen: false,
  className: 'btn btn-link',
  caption: 'Log in',
};

export default SignInButton;

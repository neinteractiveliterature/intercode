import React, { useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import AuthenticationModalContext from './AuthenticationModalContext';

function SignInButton({
  className, caption, initiallyOpen, afterSignInPath,
}) {
  const { open, setAfterSignInPath } = useContext(AuthenticationModalContext);
  const openModal = useCallback(
    () => {
      open({ currentView: 'signIn' });
      if (afterSignInPath) {
        setAfterSignInPath(afterSignInPath);
      }
    },
    [afterSignInPath, open, setAfterSignInPath],
  );

  useEffect(
    () => {
      if (initiallyOpen) {
        openModal();
      }
    },
    [initiallyOpen, openModal],
  );

  return (
    <button className={className} type="button" onClick={openModal}>
      {caption}
    </button>
  );
}

SignInButton.propTypes = {
  initiallyOpen: PropTypes.bool,
  className: PropTypes.string,
  caption: PropTypes.node,
  afterSignInPath: PropTypes.string,
};

SignInButton.defaultProps = {
  initiallyOpen: false,
  className: 'btn btn-link',
  caption: 'Log in',
  afterSignInPath: null,
};

export default SignInButton;

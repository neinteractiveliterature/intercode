import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import AuthenticationModalContext from './AuthenticationModalContext';

function SignUpButton({ className, caption, initiallyOpen }) {
  const { open } = useContext(AuthenticationModalContext);
  useEffect(
    () => {
      if (initiallyOpen) {
        open({ currentView: 'signUp' });
      }
    },
    [initiallyOpen, open],
  );

  return (
    <button className={className} type="button" onClick={() => open({ currentView: 'signUp' })}>
      {caption}
    </button>
  );
}

SignUpButton.propTypes = {
  initiallyOpen: PropTypes.bool,
  className: PropTypes.string,
  caption: PropTypes.node,
};

SignUpButton.defaultProps = {
  initiallyOpen: false,
  className: 'btn btn-primary btn-sm',
  caption: 'Sign up',
};

export default SignUpButton;

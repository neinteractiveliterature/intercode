import { useContext, useEffect, useCallback } from 'react';
import * as React from 'react';

import AuthenticationModalContext from './AuthenticationModalContext';

export type SignInButtonProps = {
  className?: string;
  caption?: React.ReactNode;
  initiallyOpen?: boolean;
  afterSignInPath?: string;
};

function SignInButton({ className, caption, initiallyOpen, afterSignInPath }: SignInButtonProps): React.JSX.Element {
  const { open, setAfterSignInPath } = useContext(AuthenticationModalContext);
  const openModal = useCallback(() => {
    open({ currentView: 'signIn' });
    if (afterSignInPath) {
      setAfterSignInPath(afterSignInPath);
    }
  }, [afterSignInPath, open, setAfterSignInPath]);

  useEffect(() => {
    if (initiallyOpen) {
      openModal();
    }
  }, [initiallyOpen, openModal]);

  return (
    <button className={className ?? 'btn btn-link'} type="button" onClick={openModal}>
      {caption ?? 'Log in'}
    </button>
  );
}

export default SignInButton;

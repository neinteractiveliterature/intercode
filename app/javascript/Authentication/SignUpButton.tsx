import { useContext, useEffect } from 'react';
import * as React from 'react';

import AuthenticationModalContext from './AuthenticationModalContext';

export type SignUpButtonProps = {
  className?: string;
  caption?: React.ReactNode;
  initiallyOpen?: boolean;
};

function SignUpButton({ className, caption, initiallyOpen }: SignUpButtonProps): React.JSX.Element {
  const { open } = useContext(AuthenticationModalContext);
  useEffect(() => {
    if (initiallyOpen) {
      open({ currentView: 'signUp' });
    }
  }, [initiallyOpen, open]);

  return (
    <button
      className={className ?? 'btn btn-primary btn-sm'}
      type="button"
      onClick={() => open({ currentView: 'signUp' })}
    >
      {caption ?? 'Sign up'}
    </button>
  );
}

export default SignUpButton;

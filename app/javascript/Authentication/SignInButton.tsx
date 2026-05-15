import { useContext, useCallback } from 'react';
import * as React from 'react';

import { AuthenticationManagerContext } from './authenticationManager';

export type SignInButtonProps = {
  className?: string;
  caption?: React.ReactNode;
  afterSignInPath?: string;
};

function SignInButton({ className, caption, afterSignInPath }: SignInButtonProps): React.JSX.Element {
  const authenticationManager = useContext(AuthenticationManagerContext);

  const onClick = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      const { redirectUrl } = await authenticationManager.initiateAuthentication(
        afterSignInPath ?? window.location.href,
      );
      window.location.href = redirectUrl.toString();
    },
    [afterSignInPath, authenticationManager],
  );

  return (
    <button className={className ?? 'btn btn-link'} type="button" onClick={onClick}>
      {caption ?? 'Log in'}
    </button>
  );
}

export default SignInButton;

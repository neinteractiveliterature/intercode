import { useContext, useCallback } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { AuthenticationManagerContext } from './authenticationManager';

export type SignInButtonProps = {
  className?: string;
  caption?: React.ReactNode;
  afterSignInPath?: string;
};

function SignInButton({ className, caption, afterSignInPath }: SignInButtonProps): React.JSX.Element {
  const { t } = useTranslation();
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
      {caption ?? t('navigation.authentication.logIn')}
    </button>
  );
}

export default SignInButton;

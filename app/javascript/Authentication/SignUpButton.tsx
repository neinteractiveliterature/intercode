import { useContext, useCallback } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { AuthenticationManagerContext } from './authenticationManager';

export type SignUpButtonProps = {
  className?: string;
  caption?: React.ReactNode;
};

function SignUpButton({ className, caption }: SignUpButtonProps): React.JSX.Element {
  const { t } = useTranslation();
  const authenticationManager = useContext(AuthenticationManagerContext);

  const onClick = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      const { redirectUrl } = await authenticationManager.initiateAuthentication(window.location.href);
      const signUpUrl = new URL('/users/sign_up', authenticationManager.issuerUrl ?? window.location.origin);
      signUpUrl.searchParams.set('user_return_to', redirectUrl.toString());
      window.location.href = signUpUrl.toString();
    },
    [authenticationManager],
  );

  return (
    <button className={className ?? 'btn btn-primary btn-sm'} type="button" onClick={onClick}>
      {caption ?? t('navigation.authentication.signUp')}
    </button>
  );
}

export default SignUpButton;

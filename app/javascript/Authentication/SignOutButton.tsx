import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import useAfterSessionChange from './useAfterSessionChange';
import { AuthenticationManagerContext } from './authenticationManager';

export type SignOutButtonProps = {
  className?: string;
  caption?: React.ReactNode;
};

function SignOutButton({ className, caption }: SignOutButtonProps): React.JSX.Element {
  const { t } = useTranslation();
  const afterSessionChange = useAfterSessionChange();
  const authenticationManager = useContext(AuthenticationManagerContext);

  const onClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const { endSessionEndpoint } = await authenticationManager.signOut();
    if (endSessionEndpoint) {
      window.location.href = endSessionEndpoint;
    } else {
      await afterSessionChange('/', {
        title: t('authentication.signOut.successTitle'),
        body: t('authentication.signOut.successBody'),
        autoDismissAfter: 1000 * 60,
      });
    }
  };

  return (
    <button className={className ?? 'btn btn-link'} type="button" onClick={onClick}>
      {caption ?? t('navigation.user.logOut')}
    </button>
  );
}

export default SignOutButton;

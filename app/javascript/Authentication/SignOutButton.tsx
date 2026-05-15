import * as React from 'react';
import { useContext } from 'react';

import useAfterSessionChange from './useAfterSessionChange';
import { AuthenticationManagerContext } from './authenticationManager';

export type SignOutButtonProps = {
  className?: string;
  caption?: React.ReactNode;
};

function SignOutButton({ className, caption }: SignOutButtonProps): React.JSX.Element {
  const afterSessionChange = useAfterSessionChange();
  const authenticationManager = useContext(AuthenticationManagerContext);

  const onClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const { endSessionEndpoint } = await authenticationManager.signOut();
    if (endSessionEndpoint) {
      window.location.href = endSessionEndpoint;
    } else {
      await afterSessionChange('/', {
        title: 'Logout',
        body: 'Logged out.',
        autoDismissAfter: 1000 * 60,
      });
    }
  };

  return (
    <button className={className ?? 'btn btn-link'} type="button" onClick={onClick}>
      {caption ?? 'Log out'}
    </button>
  );
}

export default SignOutButton;

import * as React from 'react';

import useAfterSessionChange from './useAfterSessionChange';
import { useContext } from 'react';
import { AuthenticationManager, AuthenticationManagerContext } from './authenticationManager';

async function signOut(manager: AuthenticationManager) {
  const { endSessionEndpoint } = await manager.signOut();
  if (endSessionEndpoint) {
    window.location.href = endSessionEndpoint;
  }
}

export type SignOutButtonProps = {
  className?: string;
  caption?: React.ReactNode;
};

function SignOutButton({ className, caption }: SignOutButtonProps): React.JSX.Element {
  const afterSessionChange = useAfterSessionChange();
  const authenticationManager = useContext(AuthenticationManagerContext);

  const onClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await signOut(authenticationManager);
    await afterSessionChange('/', {
      title: 'Logout',
      body: 'Logged out.',
      autoDismissAfter: 1000 * 60,
    });
  };

  return (
    <button className={className ?? 'btn btn-link'} type="button" onClick={onClick}>
      {caption ?? 'Log out'}
    </button>
  );
}

export default SignOutButton;

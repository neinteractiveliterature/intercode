import * as React from 'react';
import { useContext } from 'react';

import useAfterSessionChange from './useAfterSessionChange';
import { AuthenticityTokensContext } from '../AuthenticityTokensContext';

async function signOut(authenticityToken: string) {
  const response = await fetch('/users/sign_out', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      // Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(responseJson.error);
  }
}

export type SignOutButtonProps = {
  className?: string;
  caption?: React.ReactNode;
};

function SignOutButton({ className, caption }: SignOutButtonProps): React.JSX.Element {
  const afterSessionChange = useAfterSessionChange();
  const manager = useContext(AuthenticityTokensContext);

  const onClick = async (event: React.SyntheticEvent) => {
    const authenticityToken = manager.tokens?.signOut;

    event.preventDefault();
    await signOut(authenticityToken ?? '');
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

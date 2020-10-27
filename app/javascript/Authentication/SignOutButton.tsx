import React, { useContext } from 'react';

import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useAfterSessionChange from './useAfterSessionChange';

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

function SignOutButton({ className, caption }: SignOutButtonProps) {
  const { signOut: authenticityToken } = useContext(AuthenticityTokensContext);
  const afterSessionChange = useAfterSessionChange();

  const onClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await signOut(authenticityToken ?? '');
    await afterSessionChange('/');
  };

  return (
    <button className={className ?? 'btn btn-link'} type="button" onClick={onClick}>
      {caption ?? 'Log out'}
    </button>
  );
}

export default SignOutButton;

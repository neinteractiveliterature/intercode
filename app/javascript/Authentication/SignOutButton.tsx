import * as React from 'react';

import { useSubmit } from 'react-router';
import { useToast } from '@neinteractiveliterature/litform';

export type SignOutButtonProps = {
  className?: string;
  caption?: React.ReactNode;
};

function SignOutButton({ className, caption }: SignOutButtonProps): JSX.Element {
  const toast = useToast();
  const submit = useSubmit();

  const onClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await submit(null, { method: 'DELETE', action: '/users/sign_out' });
    toast({
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

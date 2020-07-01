import React from 'react';

import WithdrawSignupButton, { WithdrawSignupButtonProps } from './WithdrawSignupButton';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import { useWithdrawMySignupMutation } from './mutations.generated';

export type WithdrawMySignupButtonProps = WithdrawSignupButtonProps & {
  run: {
    id: number,
  },
  event: {
    title: string,
  },
  reloadOnSuccess?: boolean,
};

function WithdrawMySignupButton({
  run, event, reloadOnSuccess, ...otherProps
}: WithdrawMySignupButtonProps) {
  const [withdrawMutate] = useWithdrawMySignupMutation();
  const confirm = useConfirm();
  const withdrawSignup = () => confirm({
    prompt: `Are you sure you want to withdraw from ${event.title}?`,
    action: async () => {
      await withdrawMutate({ variables: { runId: run.id } });
      if (reloadOnSuccess) {
        window.location.reload();
      }
    },
    renderError: (error) => <ErrorDisplay graphQLError={error} />,
  });

  return (
    <WithdrawSignupButton
      {...otherProps}
      withdrawSignup={withdrawSignup}
      buttonClass="withdraw-user-signup-button btn-outline-danger"
    />
  );
}

export default WithdrawMySignupButton;

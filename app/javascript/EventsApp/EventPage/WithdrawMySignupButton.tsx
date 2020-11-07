import { useTranslation } from 'react-i18next';

import WithdrawSignupButton, { WithdrawSignupButtonProps } from './WithdrawSignupButton';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import { EventPageQueryQuery } from './queries.generated';
import { useWithdrawMySignupMutation } from './mutations.generated';

export type WithdrawMySignupButtonProps = Omit<WithdrawSignupButtonProps, 'withdrawSignup'> & {
  run: EventPageQueryQuery['event']['runs'][0];
  event: EventPageQueryQuery['event'];
  reloadOnSuccess?: boolean;
};

function WithdrawMySignupButton({
  run,
  event,
  reloadOnSuccess,
  ...otherProps
}: WithdrawMySignupButtonProps) {
  const { t } = useTranslation();
  const [withdrawMutate] = useWithdrawMySignupMutation();
  const confirm = useConfirm();
  const withdrawSignup = () =>
    confirm({
      prompt: t(
        'events.withdrawPrompt.selfServiceSignup',
        'Are you sure you want to withdraw from {{ eventTitle }}?',
        { eventTitle: event.title },
      ),
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
      withdrawSignup={withdrawSignup}
      buttonClass="withdraw-user-signup-button btn-outline-danger"
      {...otherProps}
    />
  );
}

export default WithdrawMySignupButton;

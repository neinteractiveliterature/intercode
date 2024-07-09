import { useTranslation } from 'react-i18next';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import WithdrawSignupButton, { WithdrawSignupButtonProps } from './WithdrawSignupButton';
import { EventPageQueryData } from './queries.generated';
import { useWithdrawMySignupMutation } from './mutations.generated';

export type WithdrawMySignupButtonProps = Omit<WithdrawSignupButtonProps, 'withdrawSignup'> & {
  run: EventPageQueryData['convention']['event']['runs'][0];
  event: EventPageQueryData['convention']['event'];
  reloadOnSuccess?: boolean;
};

function WithdrawMySignupButton({
  run,
  event,
  reloadOnSuccess,
  ...otherProps
}: WithdrawMySignupButtonProps): JSX.Element {
  const { t } = useTranslation();
  const [withdrawMutate] = useWithdrawMySignupMutation();
  const confirm = useConfirm();
  const withdrawSignup = () =>
    confirm({
      prompt: t('events.withdrawPrompt.selfServiceSignup', {
        eventTitle: event.title,
      }),
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

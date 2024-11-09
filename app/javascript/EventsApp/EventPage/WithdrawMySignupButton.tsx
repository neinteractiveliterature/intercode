import WithdrawSignupButton, { WithdrawSignupButtonProps } from './WithdrawSignupButton';
import { useWithdrawMySignupModal, WithdrawMySignupModalProps } from './WithdrawMySignupModal';

export type WithdrawMySignupButtonProps = Omit<WithdrawSignupButtonProps, 'withdrawSignup'> &
  Omit<WithdrawMySignupModalProps, 'close'> & {
    reloadOnSuccess?: boolean;
  };

function WithdrawMySignupButton({
  run,
  event,
  reloadOnSuccess,
  signup,
  signupRounds,
  ...otherProps
}: WithdrawMySignupButtonProps): JSX.Element {
  const withdrawMySignupModal = useWithdrawMySignupModal();

  return (
    <>
      <WithdrawSignupButton
        withdrawSignup={() => withdrawMySignupModal.openModal({ event, run, signup, signupRounds })}
        buttonClass="withdraw-user-signup-button btn-outline-danger"
        {...otherProps}
      />

      <withdrawMySignupModal.Component />
    </>
  );
}

export default WithdrawMySignupButton;

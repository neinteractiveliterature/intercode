import { useTranslation } from 'react-i18next';

export type WithdrawSignupButtonProps = {
  buttonClass?: string;
  buttonText?: string;
  withdrawSignup: () => void;
};

function WithdrawSignupButton({
  buttonClass,
  buttonText,
  withdrawSignup,
}: WithdrawSignupButtonProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <button
      className={`btn ${buttonClass || 'btn-outline-danger'} withdraw-button`}
      type="button"
      onClick={withdrawSignup}
    >
      {buttonText ?? t('signups.withdrawButton', 'Withdraw')}
    </button>
  );
}

export default WithdrawSignupButton;

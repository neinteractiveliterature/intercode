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
}: WithdrawSignupButtonProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <button
      className={`btn ${buttonClass || 'btn-outline-danger'} withdraw-button`}
      type="button"
      onClick={withdrawSignup}
    >
      {buttonText ?? t('signups.withdrawButton')}
    </button>
  );
}

export default WithdrawSignupButton;

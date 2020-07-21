import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function WithdrawSignupButton({
  buttonClass, buttonText, withdrawSignup,
}) {
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

WithdrawSignupButton.propTypes = {
  run: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  buttonClass: PropTypes.string,
  buttonText: PropTypes.string,
  withdrawSignup: PropTypes.func.isRequired,
};

WithdrawSignupButton.defaultProps = {
  buttonClass: null,
  buttonText: null,
};

export default WithdrawSignupButton;

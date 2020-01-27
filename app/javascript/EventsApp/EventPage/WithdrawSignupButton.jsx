import React from 'react';
import PropTypes from 'prop-types';

function WithdrawSignupButton({
  buttonClass, buttonText, withdrawSignup,
}) {
  return (
    <button
      className={`btn ${buttonClass || 'btn-outline-danger'} withdraw-button`}
      type="button"
      onClick={withdrawSignup}
    >
      {buttonText || 'Withdraw'}
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

import React, { MouseEventHandler } from 'react';

export type WithdrawSignupButtonProps = {
  buttonClass?: string,
  buttonText?: string,
  withdrawSignup: MouseEventHandler,
};

function WithdrawSignupButton(
  { buttonClass, buttonText, withdrawSignup }: WithdrawSignupButtonProps,
) {
  return (
    <button
      className={`btn ${buttonClass ?? 'btn-outline-danger'} withdraw-button`}
      type="button"
      onClick={withdrawSignup}
    >
      {buttonText ?? 'Withdraw'}
    </button>
  );
}

export default WithdrawSignupButton;

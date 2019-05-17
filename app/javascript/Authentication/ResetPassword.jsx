import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import PasswordConfirmationInput from './PasswordConfirmationInput';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';
import useUniqueId from '../useUniqueId';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

async function changePassword(
  authenticityToken, resetPasswordToken, password, passwordConfirmation,
) {
  const formData = new FormData();
  formData.append('user[reset_password_token]', resetPasswordToken);
  formData.append('user[password]', password);
  formData.append('user[password_confirmation]', passwordConfirmation);

  const response = await fetch('/users/password', {
    method: 'PUT',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    throw new Error((await response.json()).error);
  }
}

function ResetPassword({ resetPasswordToken }) {
  const authenticityToken = useContext(AuthenticityTokensContext).changePassword;
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const passwordId = useUniqueId('password-');
  const [
    changePasswordAsync, changePasswordError, changePasswordInProgress,
  ] = useAsyncFunction(changePassword);

  const onSubmit = async (event) => {
    event.preventDefault();
    await changePasswordAsync(
      authenticityToken, resetPasswordToken, password, passwordConfirmation,
    );
    window.location.href = '/';
  };

  return (
    <>
      <h1 className="mb-4">Reset password</h1>

      <form onSubmit={onSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label htmlFor={passwordId}>Password</label>
              <PasswordInputWithStrengthCheck
                value={password}
                onChange={setPassword}
                id={passwordId}
                disabled={changePasswordInProgress}
              />
            </div>
            <PasswordConfirmationInput
              value={passwordConfirmation}
              onChange={setPasswordConfirmation}
              password={password}
              disabled={changePasswordInProgress}
            />

            <ErrorDisplay stringError={(changePasswordError || {}).message} />
          </div>

          <div className="card-footer text-right">
            <input type="submit" value="Set password" className="btn btn-primary" />
          </div>
        </div>
      </form>
    </>
  );
}

ResetPassword.propTypes = {
  resetPasswordToken: PropTypes.string.isRequired,
};

export default ResetPassword;

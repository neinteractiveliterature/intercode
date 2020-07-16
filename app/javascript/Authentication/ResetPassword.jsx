import React, {
  useState, useContext, useMemo, Suspense,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PasswordConfirmationInput from './PasswordConfirmationInput';
import useUniqueId from '../useUniqueId';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../checkBundleHash';

const PasswordInputWithStrengthCheck = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "password-input-with-strength-check" */ './PasswordInputWithStrengthCheck'));

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

function ResetPassword() {
  const { t } = useTranslation();
  const location = useLocation();
  const resetPasswordToken = useMemo(
    () => new URLSearchParams(location.search).get('reset_password_token'),
    [location.search],
  );
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
      <h1 className="mb-4">{t('authentication.resetPassword.header', 'Reset password')}</h1>

      <form onSubmit={onSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label htmlFor={passwordId}>
                {t('authentication.resetPassword.passwordLabel', 'Password')}
              </label>
              <Suspense fallback={<LoadingIndicator />}>
                <PasswordInputWithStrengthCheck
                  value={password}
                  onChange={setPassword}
                  id={passwordId}
                  disabled={changePasswordInProgress}
                />
              </Suspense>
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
            <input
              type="submit"
              value={t('authentication.resetPassword.setPasswordButton', 'Set password')}
              className="btn btn-primary"
              aria-label={t('authentication.resetPassword.setPasswordButton', 'Set password')}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default ResetPassword;

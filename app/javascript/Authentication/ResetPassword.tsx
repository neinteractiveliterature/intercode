import { useState, useMemo, Suspense, useId } from 'react';
import * as React from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import PasswordConfirmationInput from './PasswordConfirmationInput';
import useAsyncFunction from '../useAsyncFunction';
import AuthenticityTokensManager from '../AuthenticityTokensContext';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';

async function changePassword(
  authenticityToken: string,
  resetPasswordToken: string,
  password: string,
  passwordConfirmation: string,
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

function ResetPassword(): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const resetPasswordToken = useMemo(
    () => new URLSearchParams(location.search).get('reset_password_token') ?? '',
    [location.search],
  );
  const authenticityToken = AuthenticityTokensManager.instance.tokens.changePassword;
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const passwordId = useId();
  const [changePasswordAsync, changePasswordError] = useAsyncFunction(changePassword);

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!authenticityToken) {
      throw new Error('No authenticity token received from server');
    }

    await changePasswordAsync(authenticityToken, resetPasswordToken, password, passwordConfirmation);
    window.location.href = '/';
  };

  return (
    <>
      <h1 className="mb-4">{t('authentication.resetPassword.header')}</h1>
      <form onSubmit={onSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label" htmlFor={passwordId}>
                {t('authentication.resetPassword.passwordLabel')}
              </label>
              <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
                <PasswordInputWithStrengthCheck value={password} onChange={setPassword} id={passwordId} />
              </Suspense>
            </div>
            <PasswordConfirmationInput
              value={passwordConfirmation}
              onChange={setPasswordConfirmation}
              password={password}
            />

            <ErrorDisplay stringError={(changePasswordError || {}).message} />
          </div>

          <div className="card-footer text-end">
            <input
              type="submit"
              value={t('authentication.resetPassword.setPasswordButton').toString()}
              className="btn btn-primary"
              aria-label={t('authentication.resetPassword.setPasswordButton')}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default ResetPassword;

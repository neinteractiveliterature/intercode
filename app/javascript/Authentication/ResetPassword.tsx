import { useState, useMemo, Suspense, useId } from 'react';
import * as React from 'react';
import { Form, redirect, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import PasswordConfirmationInput from './PasswordConfirmationInput';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';
import { Route } from './+types/ResetPassword';
import { getBackendBaseUrl } from 'getBackendBaseUrl';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const tokens = await context.authenticityTokensManager.getTokens();

  const response = await fetch(new URL('/users/password', getBackendBaseUrl()), {
    method: 'PUT',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Cookie: request.headers.get('cookie') ?? '',
      'X-CSRF-Token': tokens.changePassword ?? '',
    },
  });

  if (!response.ok) {
    return new Error((await response.json()).error);
  }

  await context.client.resetStore();

  return redirect('/');
}

function ResetPassword({ actionData: resetPasswordError }: Route.ComponentProps): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const resetPasswordToken = useMemo(
    () => new URLSearchParams(location.search).get('reset_password_token') ?? '',
    [location.search],
  );
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const passwordId = useId();

  return (
    <>
      <h1 className="mb-4">{t('authentication.resetPassword.header')}</h1>
      <Form method="PATCH">
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label" htmlFor={passwordId}>
                {t('authentication.resetPassword.passwordLabel')}
              </label>
              <Suspense fallback={<LoadingIndicator />}>
                <PasswordInputWithStrengthCheck
                  name="user[password]"
                  value={password}
                  onChange={setPassword}
                  id={passwordId}
                />
              </Suspense>
            </div>
            <PasswordConfirmationInput
              name="user[password_confirmation]"
              value={passwordConfirmation}
              onChange={setPasswordConfirmation}
              password={password}
            />
            <input type="hidden" name="user[reset_password_token]" value={resetPasswordToken} />

            <ErrorDisplay stringError={resetPasswordError?.message} />
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
      </Form>
    </>
  );
}

export default ResetPassword;

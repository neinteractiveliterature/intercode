import { useState, useContext } from 'react';
import * as React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { BootstrapFormInput, ErrorDisplay } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';
import humanize from '../humanize';
import { AuthenticityTokensContext } from '../AuthenticityTokensContext';
import usePageTitle from '../usePageTitle';

function parseRailsErrorHash(errors: Record<string, string[]> | undefined) {
  if (!errors) {
    return undefined;
  }

  return Object.entries(errors)
    .flatMap(([key, keyErrors]) => keyErrors.map((keyError) => `${humanize(key)} ${keyError}`))
    .join(', ');
}

async function resetPassword(authenticityToken: string, email: string) {
  const formData = new FormData();
  formData.append('user[email]', email);

  const response = await fetch('/users/password', {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.error ?? parseRailsErrorHash(responseJson.errors) ?? response.statusText);
  }

  return responseJson;
}

function DeviseForgotPasswordPage(): React.JSX.Element {
  const { t } = useTranslation();
  const manager = useContext(AuthenticityTokensContext);
  const authenticityToken = manager.tokens?.resetPassword;
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetPasswordAsync, resetPasswordError, resetPasswordInProgress] = useAsyncFunction(resetPassword);
  usePageTitle(t('authentication.forgotPasswordForm.header'));

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!authenticityToken) {
      throw new Error('No authenticity token received from server');
    }

    await resetPasswordAsync(authenticityToken, email);
    setSuccess(true);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="lead">{t('authentication.forgotPasswordForm.header')}</div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="card-body p-4">
                {success ? (
                  <Trans i18nKey="authentication.forgotPasswordForm.successMessage">
                    <p>
                      Please check your email. You should receive instructions on how to reset your password shortly.
                    </p>
                    <p>
                      If you don’t receive instructions, please email{' '}
                      <a href="mailto:webmaster@interactiveliterature.org">our web team</a> for help resetting your
                      password.
                    </p>
                  </Trans>
                ) : (
                  <BootstrapFormInput
                    type="email"
                    label={t('authentication.forgotPasswordForm.emailLabel')}
                    value={email}
                    onTextChange={setEmail}
                    disabled={resetPasswordInProgress}
                  />
                )}
                <ErrorDisplay stringError={(resetPasswordError || {}).message} />
              </div>
              <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column align-items-start">
                  <a href="/users/sign_up" className="btn btn-link p-0 mb-1">
                    {t('authentication.signUpLink')}
                  </a>
                  <a href="/users/sign_in" className="btn btn-link p-0">
                    {t('authentication.logInLink')}
                  </a>
                </div>
                <div>
                  {success ? (
                    <a href="/" className="btn btn-secondary">
                      {t('buttons.ok')}
                    </a>
                  ) : (
                    <button type="submit" className="btn btn-primary" disabled={resetPasswordInProgress}>
                      {t('authentication.forgotPassword.sendInstructionsButton')}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Component = DeviseForgotPasswordPage;

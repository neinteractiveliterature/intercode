import React, { useState, useContext } from 'react';
import fetch from 'unfetch';
import { useTranslation, Trans } from 'react-i18next';

import AuthenticationModalContext from './AuthenticationModalContext';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

async function resetPassword(authenticityToken, email) {
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
    throw new Error(responseJson.error);
  }

  return responseJson;
}

function ForgotPasswordForm() {
  const { t } = useTranslation();
  const { close: closeModal, setCurrentView } = useContext(AuthenticationModalContext);
  const authenticityToken = useContext(AuthenticityTokensContext).resetPassword;
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [
    resetPasswordAsync, resetPasswordError, resetPasswordInProgress,
  ] = useAsyncFunction(resetPassword);

  const onSubmit = async (event) => {
    event.preventDefault();
    await resetPasswordAsync(authenticityToken, email);
    setSuccess(true);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">
            {t('authentication.forgotPasswordForm.header', 'Forgot your password?')}
          </div>
        </div>

        <div className="modal-body">
          {
            success
              ? (
                <Trans i18nKey="authentication.forgotPasswordForm.successMessage">
                  <p>
                    Please check your email.  You should receive instructions on how to reset your
                    {' '}
                    password shortly.
                  </p>

                  <p>
                    If you don&rsquo;t receive instructions, please email
                    {' '}
                    <a href="mailto:webmaster@interactiveliterature.org">our web team</a>
                    {' '}
                    for help resetting your password.
                  </p>
                </Trans>
              )
              : (
                <BootstrapFormInput
                  type="email"
                  label={t('authentication.forgotPasswordForm.emailLabel', 'Email')}
                  value={email}
                  onTextChange={setEmail}
                  disabled={resetPasswordInProgress}
                />
              )
          }
        </div>

        <ErrorDisplay stringError={(resetPasswordError || {}).message} />

        <div className="modal-footer bg-light">
          <div className="flex-grow-1 d-flex flex-column align-items-start">
            <button type="button" className="btn btn-link p-0 mb-1" onClick={() => { setCurrentView('signUp'); }}>
              {t('authentication.signUpLink', 'Sign up for an account')}
            </button>
            <button type="button" className="btn btn-link p-0" onClick={() => { setCurrentView('signIn'); }}>
              {t('authentication.logInLink', 'Log in to an existing account')}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              disabled={resetPasswordInProgress}
              onClick={closeModal}
            >
              {success ? t('buttons.ok', 'OK') : t('buttons.cancel', 'Cancel')}
            </button>
            {!success && (
              <input
                type="submit"
                className="btn btn-primary"
                disabled={resetPasswordInProgress}
                value={t('authentication.forgotPassword.sendInstructionsButton', 'Send instructions')}
                aria-label={t('authentication.forgotPassword.sendInstructionsButton', 'Send instructions')}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default ForgotPasswordForm;

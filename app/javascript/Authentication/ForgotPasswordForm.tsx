import { useState, useContext } from 'react';
import * as React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { BootstrapFormInput, ErrorDisplay } from '@neinteractiveliterature/litform';

import AuthenticationModalContext from './AuthenticationModalContext';
import { useFetcher } from 'react-router';

function ForgotPasswordForm(): JSX.Element {
  const { t } = useTranslation();
  const { close: closeModal, setCurrentView } = useContext(AuthenticationModalContext);
  const [email, setEmail] = useState('');
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const success = fetcher.data && !error;

  return (
    <>
      <fetcher.Form action="/password/reset" method="POST">
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">{t('authentication.forgotPasswordForm.header')}</div>
        </div>

        <div className="modal-body">
          {success ? (
            <Trans i18nKey="authentication.forgotPasswordForm.successMessage">
              <p>Please check your email. You should receive instructions on how to reset your password shortly.</p>

              <p>
                If you don’t receive instructions, please email{' '}
                <a href="mailto:webmaster@interactiveliterature.org">our web team</a> for help resetting your password.
              </p>
            </Trans>
          ) : (
            <BootstrapFormInput
              type="email"
              label={t('authentication.forgotPasswordForm.emailLabel')}
              value={email}
              onTextChange={setEmail}
              disabled={fetcher.state !== 'idle'}
            />
          )}

          <ErrorDisplay stringError={error?.message} />
        </div>

        <div className="modal-footer bg-light">
          <div className="flex-grow-1 d-flex flex-column align-items-start">
            <button
              type="button"
              className="btn btn-link p-0 mb-1"
              onClick={() => {
                setCurrentView('signUp');
              }}
            >
              {t('authentication.signUpLink')}
            </button>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => {
                setCurrentView('signIn');
              }}
            >
              {t('authentication.logInLink')}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary me-2"
              disabled={fetcher.state !== 'idle'}
              onClick={closeModal}
            >
              {success ? t('buttons.ok') : t('buttons.cancel')}
            </button>
            {!success && (
              <input
                type="submit"
                className="btn btn-primary"
                disabled={fetcher.state !== 'idle'}
                value={t('authentication.forgotPassword.sendInstructionsButton').toString()}
                aria-label={t('authentication.forgotPassword.sendInstructionsButton')}
              />
            )}
          </div>
        </div>
      </fetcher.Form>
    </>
  );
}

export default ForgotPasswordForm;

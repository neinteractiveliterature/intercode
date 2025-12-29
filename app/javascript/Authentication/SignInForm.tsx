import { useContext } from 'react';

import * as React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import AuthenticationModalContext from './AuthenticationModalContext';
import useAsyncFunction from '../useAsyncFunction';
import { AuthenticationManager, AuthenticationManagerContext } from './authenticationManager';

async function initiateOAuthFlow(authenticationManager: AuthenticationManager, returnPath?: string) {
  const { redirectUrl } = await authenticationManager.initiateAuthentication(returnPath);
  window.location.href = redirectUrl.toString();
}

function SignInForm(): React.JSX.Element {
  const authenticationManager = useContext(AuthenticationManagerContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    close: closeModal,
    setCurrentView,
    afterSignInPath,
    unauthenticatedError,
    setUnauthenticatedError,
  } = useContext(AuthenticationModalContext);

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await initiateOAuthFlow(authenticationManager, afterSignInPath);
  };

  const onCancel = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (unauthenticatedError) {
      navigate('/');
      closeModal();
      setUnauthenticatedError(false);
    } else {
      closeModal();
    }
  };

  const [submit, submitError, submitInProgress] = useAsyncFunction(onSubmit, {
    suppressError: true,
  });

  return (
    <>
      <form onSubmit={submit}>
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">{t('authentication.signInForm.header')}</div>
        </div>

        <div className="modal-body">
          <p>
            {t(
              'authentication.signInForm.oauthDescription',
              'You will be redirected to a secure login page to sign in.',
            )}
          </p>

          <ErrorDisplay stringError={(submitError || {}).message} />
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
                setCurrentView('forgotPassword');
              }}
            >
              {t('authentication.forgotPasswordLink')}
            </button>
          </div>
          <div>
            <button type="button" className="btn btn-secondary me-2" disabled={submitInProgress} onClick={onCancel}>
              {t('buttons.cancel')}
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={submitInProgress}
              value={t('authentication.signInForm.logInButton').toString()}
              aria-label={t('authentication.signInForm.logInButton')}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default SignInForm;

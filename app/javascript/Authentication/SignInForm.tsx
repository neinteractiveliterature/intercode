import { useContext } from 'react';

import * as React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import AuthenticationModalContext from './AuthenticationModalContext';
import useAsyncFunction from '../useAsyncFunction';
import { AppSession, commitSessionToBrowser, SessionContext } from '~/sessions';
import { discoverOpenidConfig, generatePKCEChallenge, getAuthorizationRedirectURL } from './openid';

async function initiateOAuthFlow(session: AppSession, returnPath?: string) {
  const config = await discoverOpenidConfig();
  const pkceChallenge = await generatePKCEChallenge();

  session.set('pkceChallenge', pkceChallenge);
  await commitSessionToBrowser(session);

  if (returnPath) {
    sessionStorage.setItem('oauth_return_path', returnPath);
  }

  const backendUrl = getAuthorizationRedirectURL(config, pkceChallenge);
  window.location.href = backendUrl.toString();
}

function SignInForm(): React.JSX.Element {
  const session = useContext(SessionContext);
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
    await initiateOAuthFlow(session, afterSignInPath);
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

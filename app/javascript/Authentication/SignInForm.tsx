import { useState, useContext } from 'react';

import * as React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BootstrapFormInput, BootstrapFormCheckbox, ErrorDisplay } from '@neinteractiveliterature/litform';

import AuthenticationModalContext from './AuthenticationModalContext';
import useAsyncFunction from '../useAsyncFunction';
import useAfterSessionChange from './useAfterSessionChange';
import AuthenticityTokensManager from '../AuthenticityTokensContext';
import errorReporting from 'ErrorReporting';

async function signIn(authenticityToken: string, email: string, password: string, rememberMe: boolean) {
  const formData = new FormData();
  formData.append('user[email]', email);
  formData.append('user[password]', password);
  if (rememberMe) {
    formData.append('user[remember_me]', '1');
  }

  const response = await fetch('/users/sign_in', {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    if (response.headers.get('Content-type')?.startsWith('application/json')) {
      throw new Error((await response.json()).error || response.statusText);
    }

    throw new Error((await response.text()) || response.statusText);
  }

  return response.url;
}

function SignInForm(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    close: closeModal,
    setCurrentView,
    afterSignInPath,
    unauthenticatedError,
    setUnauthenticatedError,
  } = useContext(AuthenticationModalContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const afterSessionChange = useAfterSessionChange();

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const { signIn: authenticityToken } = AuthenticityTokensManager.instance.tokens;

    if (!authenticityToken) {
      throw new Error('No authenticity token received from server');
    }

    try {
      const location = await signIn(authenticityToken, email, password, rememberMe);
      await afterSessionChange(afterSignInPath || location, {
        title: 'Login',
        body: 'Logged in successfully!',
        autoDismissAfter: 1000 * 60,
      });
    } catch (e) {
      if (!e.message.match(/invalid email or password/i)) {
        errorReporting().error(e);
      }

      // we're doing suppressError below specifically so that we can not capture invalid email
      // or password errors
      throw e;
    }
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
          <BootstrapFormInput
            type="email"
            label={t('authentication.signInForm.emailLabel')}
            value={email}
            onTextChange={setEmail}
            disabled={submitInProgress}
          />

          <BootstrapFormInput
            type="password"
            label={t('authentication.signInForm.passwordLabel')}
            value={password}
            onTextChange={setPassword}
            disabled={submitInProgress}
          />

          <BootstrapFormCheckbox
            type="checkbox"
            label={t('authentication.signInForm.rememberMeLabel')}
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={submitInProgress}
          />

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

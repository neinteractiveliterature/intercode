import { useState, useContext, useRef } from 'react';

import * as React from 'react';
import { useFetcher, useNavigate, useNavigation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BootstrapFormInput, BootstrapFormCheckbox, ErrorDisplay, useToast } from '@neinteractiveliterature/litform';
import { Info as SignInInfo } from './+types/sign_in';

import AuthenticationModalContext from './AuthenticationModalContext';
import errorReporting from 'ErrorReporting';

function SignInForm(): JSX.Element {
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
  const fetcher = useFetcher<SignInInfo['actionData']>();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const navigation = useNavigation();
  const busy = fetcher.state !== 'idle' || navigation.state !== 'idle';

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await fetcher.submit(formRef.current, { action: '/users/sign_in', method: 'POST' });
  };

  React.useEffect(() => {
    const afterSignIn = async (destinationString: string) => {
      const destination = new URL(destinationString, window.location.href);
      toast({
        title: 'Login',
        body: 'Logged in successfully!',
        autoDismissAfter: 1000 * 60,
      });

      await navigate(destination.pathname + destination.search);
      closeModal();
    };

    if (fetcher.data instanceof Error) {
      if (!fetcher.data.message.match(/invalid email or password/i)) {
        errorReporting().error(fetcher.data);
      }
      return;
    }

    if (typeof fetcher.data !== 'string') {
      return;
    }

    afterSignIn(fetcher.data);
  }, [afterSignInPath, toast, closeModal, navigate, fetcher.data]);

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

  return (
    <>
      <form onSubmit={onSubmit} ref={formRef}>
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">{t('authentication.signInForm.header')}</div>
        </div>

        <div className="modal-body">
          <BootstrapFormInput
            name="user[email]"
            type="email"
            label={t('authentication.signInForm.emailLabel')}
            value={email}
            onTextChange={setEmail}
            disabled={busy}
          />

          <BootstrapFormInput
            name="user[password]"
            type="password"
            label={t('authentication.signInForm.passwordLabel')}
            value={password}
            onTextChange={setPassword}
            disabled={busy}
          />

          <BootstrapFormCheckbox
            name="user[remember_me]"
            type="checkbox"
            value="1"
            label={t('authentication.signInForm.rememberMeLabel')}
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={busy}
          />

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
                setCurrentView('forgotPassword');
              }}
            >
              {t('authentication.forgotPasswordLink')}
            </button>
          </div>
          <div>
            <button type="button" className="btn btn-secondary me-2" disabled={busy} onClick={onCancel}>
              {t('buttons.cancel')}
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={busy}
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

import { useContext, useState, Suspense, useId } from 'react';
import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay, useToast } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';
import AuthenticationModalContext from './AuthenticationModalContext';
import AccountFormContent from './AccountFormContent';
import UserFormFields from './UserFormFields';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';
import { useFetcher } from 'react-router';

function SignUpForm(): JSX.Element {
  const { t } = useTranslation();
  const { close: closeModal, setCurrentView, recaptchaSiteKey } = useContext(AuthenticationModalContext);
  const [formState, setFormState] = useState({});
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const passwordFieldId = useId();
  const formRef = React.useRef<HTMLFormElement>(null);
  const toast = useToast();
  const fetcher = useFetcher();

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    debugger;

    await fetcher.submit(formRef.current, { action: '/users/sign_up', method: 'POST' });
    toast({
      title: 'Account signup',
      body: 'Account created.  Welcome!',
      autoDismissAfter: 1000 * 60,
    });
    closeModal();
  };

  const [submit, submitError, submitInProgress] = useAsyncFunction(onSubmit, {
    suppressError: true,
  });

  return (
    <>
      <form onSubmit={submit} ref={formRef}>
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">{t('authentication.signUpForm.header')}</div>
        </div>

        <div className="modal-body">
          <AccountFormContent />
          <UserFormFields formState={formState} setFormState={setFormState} />
          <div className="mb-3">
            <label className="form-label" htmlFor={passwordFieldId}>
              {t('authentication.signUpForm.passwordLabel')}
            </label>
            <Suspense fallback={<LoadingIndicator />}>
              <PasswordInputWithStrengthCheck
                name="user[password]"
                id={passwordFieldId}
                value={password}
                onChange={setPassword}
              />
            </Suspense>
          </div>
          <PasswordConfirmationInput
            name="user[password_confirmation]"
            password={password}
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />
          <ReCAPTCHA sitekey={recaptchaSiteKey ?? ''} onChange={setCaptchaValue} />
          <input type="hidden" name="g-recaptcha-response" value={captchaValue ?? ''} />

          <ErrorDisplay stringError={(submitError || {}).message} />
        </div>

        <div className="modal-footer bg-light">
          <div className="flex-grow-1 d-flex flex-column align-items-start">
            <button
              type="button"
              className="btn btn-link p-0 mb-1"
              onClick={() => {
                setCurrentView('signIn');
              }}
            >
              {t('authentication.logInLink')}
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
            <button type="button" className="btn btn-secondary me-2" disabled={submitInProgress} onClick={closeModal}>
              {t('buttons.cancel')}
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={submitInProgress}
              value={t('authentication.signUpForm.signUpButton').toString()}
              aria-label={t('authentication.signUpForm.signUpButton')}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default SignUpForm;

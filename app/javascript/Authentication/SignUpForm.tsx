import { useContext, useState, Suspense } from 'react';
import * as React from 'react';
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from 'react-google-recaptcha';
// @ts-expect-error
import arrayToSentence from 'array-to-sentence';
import { humanize } from 'inflected';
import { useTranslation } from 'react-i18next';

import useAsyncFunction from '../useAsyncFunction';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import ErrorDisplay from '../ErrorDisplay';
import AuthenticationModalContext from './AuthenticationModalContext';
import AccountFormContent from './AccountFormContent';
import UserFormFields, { UserFormState } from './UserFormFields';
import useUniqueId from '../useUniqueId';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import useAfterSessionChange from './useAfterSessionChange';
import { lazyWithBundleHashCheck } from '../checkBundleHash';
import LoadingIndicator from '../LoadingIndicator';

const PasswordInputWithStrengthCheck = lazyWithBundleHashCheck(
  () =>
    import(
      /* webpackChunkName: "password-input-with-strength-check" */ './PasswordInputWithStrengthCheck'
    ),
);

async function signUp(
  authenticityToken: string,
  formState: UserFormState,
  password: string,
  passwordConfirmation: string,
  captchaValue: string,
) {
  const formData = new FormData();
  formData.append('user[first_name]', formState.first_name ?? '');
  formData.append('user[last_name]', formState.last_name ?? '');
  formData.append('user[email]', formState.email ?? '');
  formData.append('user[password]', password);
  formData.append('user[password_confirmation]', passwordConfirmation);
  formData.append('g-recaptcha-response', captchaValue);

  const response = await fetch('/users', {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    if (responseJson.errors) {
      throw new Error(
        Object.entries(responseJson.errors)
          .map(([key, errors]) => `${humanize(key)} ${arrayToSentence(errors)}`)
          .join(', '),
      );
    } else if (responseJson.error) {
      throw new Error((await response.json()).error);
    }

    throw new Error(response.statusText);
  }
}

function SignUpForm() {
  const { t } = useTranslation();
  const { close: closeModal, setCurrentView, recaptchaSiteKey } = useContext(
    AuthenticationModalContext,
  );
  const authenticityToken = useContext(AuthenticityTokensContext).signUp;
  const [formState, setFormState] = useState({});
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const passwordFieldId = useUniqueId('password-');
  const afterSessionChange = useAfterSessionChange();

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await signUp(authenticityToken!, formState, password, passwordConfirmation, captchaValue ?? '');
    await afterSessionChange(window.location.href, {
      title: 'Account signup',
      body: 'Account created.  Welcome!',
      autoDismissAfter: 1000 * 60,
    });
  };

  const [submit, submitError, submitInProgress] = useAsyncFunction(onSubmit, {
    suppressError: true,
  });

  return (
    <>
      <form onSubmit={submit}>
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">{t('authentication.signUpForm.header', 'Sign up')}</div>
        </div>

        <div className="modal-body">
          <AccountFormContent />
          <UserFormFields formState={formState} setFormState={setFormState} />
          <div className="form-group">
            <label htmlFor={passwordFieldId}>
              {t('authentication.signUpForm.passwordLabel', 'Password')}
            </label>
            <Suspense fallback={<LoadingIndicator />}>
              <PasswordInputWithStrengthCheck
                id={passwordFieldId}
                value={password}
                onChange={setPassword}
              />
            </Suspense>
          </div>
          <PasswordConfirmationInput
            password={password}
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />
          <ReCAPTCHA sitekey={recaptchaSiteKey ?? ''} onChange={setCaptchaValue} />

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
              {t('authentication.logInLink', 'Log in to an existing account')}
            </button>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => {
                setCurrentView('forgotPassword');
              }}
            >
              {t('authentication.forgotPasswordLink', 'Forgot your password?')}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary me-2"
              disabled={submitInProgress}
              onClick={closeModal}
            >
              {t('buttons.cancel', 'Cancel')}
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={submitInProgress}
              value={t('authentication.signUpForm.signUpButton', 'Sign up').toString()}
              aria-label={t('authentication.signUpForm.signUpButton', 'Sign up')}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default SignUpForm;

import { useState, useContext, Suspense, useId } from 'react';
import * as React from 'react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';
import arrayToSentence from 'array-to-sentence';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';
import AccountFormContent from './AccountFormContent';
import UserFormFields, { UserFormState } from './UserFormFields';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import useAfterSessionChange from './useAfterSessionChange';
import humanize from '../humanize';
import { AuthenticityTokensContext } from '../AuthenticityTokensContext';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';
import { useSignInContext } from './useSignInContext';
import usePageTitle from '../usePageTitle';
import { clientConfigurationContext } from '../AppContexts';

type DeviseSignUpPageLoaderData = {
  recaptchaSiteKey: string | null;
};

export const loader: LoaderFunction = ({ context }) => {
  const clientConfiguration = context.get(clientConfigurationContext);
  return {
    recaptchaSiteKey: clientConfiguration.recaptcha_site_key,
  } satisfies DeviseSignUpPageLoaderData;
};

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
          .map(([key, errors]) => `${humanize(key)} ${arrayToSentence(errors as string[])}`)
          .join(', '),
      );
    } else if (responseJson.error) {
      throw new Error(responseJson.error);
    }

    throw new Error(response.statusText);
  }
}

function DeviseSignUpPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { recaptchaSiteKey } = useLoaderData() as DeviseSignUpPageLoaderData;
  const manager = useContext(AuthenticityTokensContext);
  const { conventionName, oauthAppName } = useSignInContext();
  const [formState, setFormState] = useState<UserFormState>({});
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const passwordFieldId = useId();
  const afterSessionChange = useAfterSessionChange();
  const header = conventionName
    ? t('authentication.signUpForm.headerWithConvention', { conventionName })
    : oauthAppName
      ? t('authentication.signUpForm.headerWithOAuthApp', { appName: oauthAppName })
      : t('authentication.signUpForm.header');
  usePageTitle(header);

  const onSubmit = async (event: React.SyntheticEvent) => {
    const authenticityToken = manager.tokens?.signUp;
    event.preventDefault();
    if (!authenticityToken) {
      throw new Error('No authenticity token received from server');
    }

    await signUp(authenticityToken, formState, password, passwordConfirmation, captchaValue ?? '');

    const userReturnTo = new URLSearchParams(window.location.search).get('user_return_to');
    if (userReturnTo) {
      try {
        const returnUrl = new URL(userReturnTo);
        if (returnUrl.origin === window.location.origin) {
          window.location.href = returnUrl.toString();
          return;
        }
      } catch {
        // not a valid absolute URL, fall through
      }
    }

    await afterSessionChange(window.location.href, {
      title: t('authentication.signUp.successTitle'),
      body: t('authentication.signUp.successBody'),
      autoDismissAfter: 1000 * 60,
    });
  };

  const [submit, submitError, submitInProgress] = useAsyncFunction(onSubmit, {
    suppressError: true,
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="lead">{header}</div>
            </div>
            <form onSubmit={submit}>
              <div className="card-body p-4">
                <AccountFormContent />
                <UserFormFields formState={formState} setFormState={setFormState} />
                <div className="mb-3">
                  <label className="form-label" htmlFor={passwordFieldId}>
                    {t('authentication.signUpForm.passwordLabel')}
                  </label>
                  <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
                    <PasswordInputWithStrengthCheck id={passwordFieldId} value={password} onChange={setPassword} />
                  </Suspense>
                </div>
                <PasswordConfirmationInput
                  password={password}
                  value={passwordConfirmation}
                  onChange={setPasswordConfirmation}
                />
                {recaptchaSiteKey && <ReCAPTCHA sitekey={recaptchaSiteKey} onChange={setCaptchaValue} />}
                <ErrorDisplay stringError={(submitError || {}).message} />
              </div>
              <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column align-items-start">
                  <Link to="/users/sign_in" className="btn btn-link p-0 mb-1">
                    {t('authentication.logInLink')}
                  </Link>
                  <Link to="/users/password/new" className="btn btn-link p-0">
                    {t('authentication.forgotPasswordLink')}
                  </Link>
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitInProgress}>
                  {t('authentication.signUpForm.signUpButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Component = DeviseSignUpPage;

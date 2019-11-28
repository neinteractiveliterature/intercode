import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ReCAPTCHA } from 'react-google-recaptcha';
import arrayToSentence from 'array-to-sentence';
import { humanize } from 'inflected';

import useAsyncFunction from '../useAsyncFunction';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import ErrorDisplay from '../ErrorDisplay';
import AuthenticationModalContext from './AuthenticationModalContext';
import AccountFormContent from './AccountFormContent';
import UserFormFields from './UserFormFields';
import useUniqueId from '../useUniqueId';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import useAfterSessionChange from './useAfterSessionChange';

async function signUp(authenticityToken, formState, password, passwordConfirmation, captchaValue) {
  const formData = new FormData();
  formData.append('user[first_name]', formState.first_name);
  formData.append('user[last_name]', formState.last_name);
  formData.append('user[email]', formState.email);
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
      throw new Error(Object.entries(responseJson.errors).map(([key, errors]) => `${humanize(key)} ${arrayToSentence(errors)}`).join(', '));
    } else if (responseJson.error) {
      throw new Error((await response.json()).error);
    }

    throw new Error(response.statusText);
  }
}

function SignUpForm({ history }) {
  const {
    close: closeModal, setCurrentView, recaptchaSiteKey,
  } = useContext(AuthenticationModalContext);
  const authenticityToken = useContext(AuthenticityTokensContext).signUp;
  const [formState, setFormState] = useState({});
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const passwordFieldId = useUniqueId('password-');
  const afterSessionChange = useAfterSessionChange(history);

  const onSubmit = async (event) => {
    event.preventDefault();
    await signUp(authenticityToken, formState, password, passwordConfirmation, captchaValue);
    await afterSessionChange(window.location.href);
  };

  const [submit, submitError, submitInProgress] = useAsyncFunction(onSubmit);

  return (
    <>
      <form onSubmit={submit}>
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">Sign up</div>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              disabled={submitInProgress}
              onClick={() => { setCurrentView('signIn'); }}
            >
              Log in
            </button>
          </div>
        </div>

        <div className="modal-body">
          <AccountFormContent />
          <UserFormFields formState={formState} setFormState={setFormState} />
          <div className="form-group">
            <label htmlFor={passwordFieldId}>Password</label>
            <PasswordInputWithStrengthCheck
              id={passwordFieldId}
              value={password}
              onChange={setPassword}
            />
          </div>
          <PasswordConfirmationInput
            password={password}
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />
          <ReCAPTCHA
            sitekey={recaptchaSiteKey}
            onChange={setCaptchaValue}
          />

          <ErrorDisplay stringError={(submitError || {}).message} />
        </div>

        <div className="modal-footer bg-light">
          <div className="flex-grow-1">
            <button type="button" className="btn btn-link p-0" onClick={() => { setCurrentView('forgotPassword'); }}>
              Forgot your password?
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              disabled={submitInProgress}
              onClick={closeModal}
            >
              Cancel
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={submitInProgress}
              value="Sign up"
              aria-label="Sign up"
            />
          </div>
        </div>
      </form>
    </>
  );
}

SignUpForm.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default SignUpForm;

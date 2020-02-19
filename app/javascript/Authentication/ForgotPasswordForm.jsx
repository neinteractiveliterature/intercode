import React, { useState, useContext } from 'react';
import fetch from 'unfetch';

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
          <div className="lead flex-grow-1">Forgot your password?</div>
        </div>

        <div className="modal-body">
          {
            success
              ? (
                <>
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
                </>
              )
              : (
                <BootstrapFormInput
                  type="email"
                  label="Email"
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
              Sign up for an account
            </button>
            <button type="button" className="btn btn-link p-0" onClick={() => { setCurrentView('signIn'); }}>
              Log in to an existing account
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              disabled={resetPasswordInProgress}
              onClick={closeModal}
            >
              {success ? 'OK' : 'Cancel'}
            </button>
            {!success && (
              <input
                type="submit"
                className="btn btn-primary"
                disabled={resetPasswordInProgress}
                value="Send instructions"
                aria-label="Send instructions"
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default ForgotPasswordForm;

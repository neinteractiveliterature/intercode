import React, { useState, useContext } from 'react';
import fetch from 'unfetch';

import AuthenticationModalContext from './AuthenticationModalContext';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

async function signIn(authenticityToken, email, password, rememberMe) {
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
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    throw new Error((await response.text()).error);
  }

  return response.url;
}

function SignInForm() {
  const { close: closeModal, setCurrentView } = useContext(AuthenticationModalContext);
  const authenticityToken = useContext(AuthenticityTokensContext).signIn;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [signInAsync, signInError, signInInProgress] = useAsyncFunction(signIn);

  const onSubmit = async (event) => {
    event.preventDefault();
    const location = await signInAsync(authenticityToken, email, password, rememberMe);
    const destUrl = new URL(location || window.location.href, window.location.href);
    destUrl.searchParams.delete('show_authentication');
    if (destUrl.toString() === window.location.href) {
      window.location.reload();
    } else {
      window.location.href = destUrl.toString();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="modal-header bg-light align-items-center">
          <div className="lead flex-grow-1">Log in</div>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              disabled={signInInProgress}
              onClick={() => { setCurrentView('signUp'); }}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="modal-body">
          <BootstrapFormInput
            type="email"
            label="Email"
            value={email}
            onTextChange={setEmail}
            disabled={signInInProgress}
          />

          <BootstrapFormInput
            type="password"
            label="Password"
            value={password}
            onTextChange={setPassword}
            disabled={signInInProgress}
          />

          <BootstrapFormCheckbox
            label="Remember me"
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={signInInProgress}
          />
        </div>

        <ErrorDisplay stringError={(signInError || {}).message} />

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
              disabled={signInInProgress}
              onClick={closeModal}
            >
              Cancel
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={signInInProgress}
              value="Log in"
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default SignInForm;

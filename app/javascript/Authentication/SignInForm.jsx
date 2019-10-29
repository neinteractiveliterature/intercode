/* global Rollbar */

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import fetch from 'unfetch';
import { withRouter } from 'react-router-dom';

import AuthenticationModalContext from './AuthenticationModalContext';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';
import useAfterSessionChange from './useAfterSessionChange';

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
      Accept: 'application/json',
      'X-CSRF-Token': authenticityToken,
    },
  });

  if (!response.ok) {
    if (response.headers.get('Content-type').startsWith('application/json')) {
      throw new Error((await response.json()).error || response.statusText);
    }

    throw new Error((await response.text()) || response.statusText);
  }

  return response.url;
}

function SignInForm({ history }) {
  const {
    close: closeModal, setCurrentView, afterSignInPath,
    unauthenticatedError, setUnauthenticatedError,
  } = useContext(AuthenticationModalContext);
  const { signIn: authenticityToken } = useContext(AuthenticityTokensContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const afterSessionChange = useAfterSessionChange(history);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const location = await signIn(authenticityToken, email, password, rememberMe);
      await afterSessionChange(afterSignInPath || location);
    } catch (e) {
      if (!e.message.match(/invalid email or password/i)) {
        if (typeof Rollbar !== 'undefined') {
          Rollbar.error(e);
        }
      }

      // we're doing suppressError below specifically so that we can not Rollbar invalid email
      // or password errors
      throw e;
    }
  };

  const onCancel = (event) => {
    event.preventDefault();
    if (unauthenticatedError) {
      history.push('/');
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
          <div className="lead flex-grow-1">Log in</div>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              disabled={submitInProgress}
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
            disabled={submitInProgress}
          />

          <BootstrapFormInput
            type="password"
            label="Password"
            value={password}
            onTextChange={setPassword}
            disabled={submitInProgress}
          />

          <BootstrapFormCheckbox
            label="Remember me"
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={submitInProgress}
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
              onClick={onCancel}
            >
              Cancel
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={submitInProgress}
              value="Log in"
            />
          </div>
        </div>
      </form>
    </>
  );
}

SignInForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(SignInForm);

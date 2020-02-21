import React, { useState, useContext, Suspense } from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';
import { useQuery } from '@apollo/react-hooks';

import { EditUserQuery } from './queries.gql';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import useUniqueId from '../useUniqueId';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';
import AccountFormContent from './AccountFormContent';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import UserFormFields from './UserFormFields';
import usePageTitle from '../usePageTitle';
import LoadingIndicator from '../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../checkBundleHash';

const PasswordInputWithStrengthCheck = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "password-input-with-strength-check" */ './PasswordInputWithStrengthCheck'));

async function updateUser(
  authenticityToken, formState, password, passwordConfirmation, currentPassword,
) {
  const formData = new FormData();
  formData.append('user[first_name]', formState.first_name);
  formData.append('user[last_name]', formState.last_name);
  formData.append('user[email]', formState.email);
  if (password.length > 0) {
    formData.append('user[password]', password);
  }
  if (passwordConfirmation.length > 0) {
    formData.append('user[password_confirmation]', passwordConfirmation);
  }
  formData.append('user[current_password]', currentPassword);

  const response = await fetch('/users', {
    method: 'PATCH',
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
        Object.entries(responseJson.errors).map(([key, error]) => `${humanize(key)} ${error}`).join(', '),
      );
    }

    throw new Error(responseJson.error);
  }
}

function EditUserForm({ initialFormState }) {
  const authenticityToken = useContext(AuthenticityTokensContext).updateUser;
  const [formState, setFormState] = useState(initialFormState);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [updateUserAsync, updateUserError, updateUserInProgress] = useAsyncFunction(updateUser);
  const passwordFieldId = useUniqueId('password-');

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateUserAsync(
      authenticityToken, formState, password, passwordConfirmation, currentPassword,
    );
    window.location.href = '/';
  };

  return (
    <>
      <h1 className="mb-4">Update your account</h1>

      <AccountFormContent />

      <form onSubmit={onSubmit} className="card">
        <div className="card-header">
          Account data
        </div>

        <div className="card-body">
          <UserFormFields formState={formState} setFormState={setFormState} showNameWarning />
          <div className="form-group">
            <label htmlFor={passwordFieldId}>Password</label>
            <Suspense fallback={<LoadingIndicator />}>
              <PasswordInputWithStrengthCheck
                id={passwordFieldId}
                value={password}
                onChange={setPassword}
              />
            </Suspense>
            <small className="form-text text-muted">
              Leave blank if you don&rsquo;t want to change it
            </small>
          </div>
          <PasswordConfirmationInput
            password={password}
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />
          <BootstrapFormInput
            label="Current password"
            helpText="We need your current password to verify your identity"
            type="password"
            value={currentPassword}
            onTextChange={setCurrentPassword}
          />

          <ErrorDisplay stringError={(updateUserError || {}).message} />
        </div>


        <div className="card-footer text-right">
          <div>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={updateUserInProgress}
              value="Update account"
              aria-label="Update account"
            />
          </div>
        </div>
      </form>
    </>
  );
}

EditUserForm.propTypes = {
  initialFormState: PropTypes.shape({}).isRequired,
};

function EditUser() {
  const { data, loading, error } = useQuery(EditUserQuery);

  usePageTitle('Update Your Account');

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditUserForm initialFormState={data.currentUser} />
  );
}

export default EditUser;

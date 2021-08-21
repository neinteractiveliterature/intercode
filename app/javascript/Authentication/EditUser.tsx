import { useState, useContext, Suspense } from 'react';
import * as React from 'react';
import { humanize } from 'inflected';
import { useTranslation } from 'react-i18next';
import {
  BootstrapFormInput,
  LoadingIndicator,
  useUniqueId,
  ErrorDisplay,
  LoadQueryWrapper,
} from '@neinteractiveliterature/litform';

import { Redirect } from 'react-router-dom';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useAsyncFunction from '../useAsyncFunction';
import AccountFormContent from './AccountFormContent';
import UserFormFields, { UserFormState } from './UserFormFields';
import usePageTitle from '../usePageTitle';
import { lazyWithBundleHashCheck } from '../checkBundleHash';
import { useEditUserQuery } from './queries.generated';

const PasswordInputWithStrengthCheck = lazyWithBundleHashCheck(
  () =>
    import(
      /* webpackChunkName: "password-input-with-strength-check" */ './PasswordInputWithStrengthCheck'
    ),
);

async function updateUser(
  authenticityToken: string,
  formState: UserFormState,
  password: string,
  passwordConfirmation: string,
  currentPassword: string,
) {
  const formData = new FormData();
  formData.append('user[first_name]', formState.first_name ?? '');
  formData.append('user[last_name]', formState.last_name ?? '');
  formData.append('user[email]', formState.email ?? '');
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
        Object.entries(responseJson.errors)
          .map(([key, error]) => `${humanize(key)} ${error}`)
          .join(', '),
      );
    }

    throw new Error(responseJson.error);
  }
}

export default LoadQueryWrapper(
  useEditUserQuery,
  function EditUserForm({ data: { currentUser: initialFormState } }) {
    const { t } = useTranslation();
    const authenticityToken = useContext(AuthenticityTokensContext).updateUser;
    const [formState, setFormState] = useState<UserFormState | undefined>(
      initialFormState ?? undefined,
    );
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [updateUserAsync, updateUserError, updateUserInProgress] = useAsyncFunction(updateUser);
    const passwordFieldId = useUniqueId('password-');
    usePageTitle('Update Your Account');

    if (!formState) {
      return <Redirect to="/" />;
    }

    const onSubmit = async (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (!formState) {
        return;
      }
      await updateUserAsync(
        authenticityToken!,
        formState,
        password,
        passwordConfirmation,
        currentPassword,
      );
      window.location.href = '/';
    };

    return (
      <>
        <h1 className="mb-4">{t('authentication.editUser.header', 'Update your account')}</h1>

        <AccountFormContent />

        <form onSubmit={onSubmit} className="card">
          <div className="card-header">
            {t('authentication.editUser.accountDataHeader', 'Account data')}
          </div>

          <div className="card-body">
            <UserFormFields formState={formState} setFormState={setFormState} showNameWarning />
            <div className="mb-3">
              <label className="form-label" htmlFor={passwordFieldId}>
                {t('authentication.editUser.passwordLabel', 'Password')}
              </label>
              <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
                <PasswordInputWithStrengthCheck
                  id={passwordFieldId}
                  value={password}
                  onChange={setPassword}
                />
              </Suspense>
              <small className="form-text text-muted">
                {t(
                  'authentication.editUser.passwordHelpText',
                  'Leave blank if you don’t want to change it',
                )}
              </small>
            </div>
            <PasswordConfirmationInput
              password={password}
              value={passwordConfirmation}
              onChange={setPasswordConfirmation}
            />
            <BootstrapFormInput
              label={t('authentication.editUser.currentPasswordLabel', 'Current password')}
              helpText={t(
                'authentication.editUser.currentPasswordHelpText',
                'We need your current password to verify your identity',
              )}
              type="password"
              value={currentPassword}
              onTextChange={setCurrentPassword}
            />

            <ErrorDisplay stringError={(updateUserError || {}).message} />
          </div>

          <div className="card-footer text-end">
            <div>
              <input
                type="submit"
                className="btn btn-primary"
                disabled={updateUserInProgress}
                value={t(
                  'authentication.editUser.updateAccountButton',
                  'Update account',
                ).toString()}
                aria-label={t('authentication.editUser.updateAccountButton', 'Update account')}
              />
            </div>
          </div>
        </form>
      </>
    );
  },
);

import { useState, Suspense, useId, useContext } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BootstrapFormInput, LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import { LoaderFunction, RouterContextProvider, Navigate, useLoaderData } from 'react-router';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import useAsyncFunction from '../useAsyncFunction';
import AccountFormContent from './AccountFormContent';
import UserFormFields, { UserFormState } from './UserFormFields';
import usePageTitle from '../usePageTitle';
import { EditUserQueryData, EditUserQueryDocument } from './queries.generated';
import humanize from '../humanize';
import { AuthenticityTokensContext } from '../AuthenticityTokensContext';
import { apolloClientContext } from 'AppContexts';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';

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

export const loader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<EditUserQueryData>({ query: EditUserQueryDocument });
  return data;
};

function EditUserForm() {
  const { currentUser: initialFormState } = useLoaderData() as EditUserQueryData;
  const { t } = useTranslation();
  const manager = useContext(AuthenticityTokensContext);
  const authenticityToken = manager.tokens?.updateUser;
  const [formState, setFormState] = useState<UserFormState>(initialFormState ?? {});
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [updateUserAsync, updateUserError, updateUserInProgress] = useAsyncFunction(updateUser);
  const [saved, setSaved] = useState(false);
  const passwordFieldId = useId();
  usePageTitle('Update Your Account');

  if (!formState) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!formState) {
      return;
    }
    if (!authenticityToken) {
      throw new Error('No authenticity token received from server');
    }

    await updateUserAsync(authenticityToken, formState, password, passwordConfirmation, currentPassword);
    setSaved(true);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="lead">{t('authentication.editUser.header')}</div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="card-body p-4">
                <AccountFormContent />
                <UserFormFields formState={formState} setFormState={setFormState} showNameWarning />
                <div className="mb-3">
                  <label className="form-label" htmlFor={passwordFieldId}>
                    {t('authentication.editUser.passwordLabel')}
                  </label>
                  <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
                    <PasswordInputWithStrengthCheck id={passwordFieldId} value={password} onChange={setPassword} />
                  </Suspense>
                  <small className="form-text text-muted">{t('authentication.editUser.passwordHelpText')}</small>
                </div>
                <PasswordConfirmationInput
                  password={password}
                  value={passwordConfirmation}
                  onChange={setPasswordConfirmation}
                />
                <BootstrapFormInput
                  label={t('authentication.editUser.currentPasswordLabel')}
                  helpText={t('authentication.editUser.currentPasswordHelpText')}
                  type="password"
                  value={currentPassword}
                  onTextChange={setCurrentPassword}
                />
                <ErrorDisplay stringError={(updateUserError || {}).message} />
              </div>
              <div className="card-footer bg-light text-end">
                {saved ? <span className="text-success">Saved! </span> : null}
                <input
                  type="submit"
                  className="btn btn-primary"
                  disabled={updateUserInProgress}
                  value={t('authentication.editUser.updateAccountButton').toString()}
                  aria-label={t('authentication.editUser.updateAccountButton')}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Component = EditUserForm;

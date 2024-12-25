import { useState, Suspense, useId } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BootstrapFormInput, LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import { Navigate, redirect, useNavigation } from 'react-router';
import PasswordConfirmationInput from './PasswordConfirmationInput';
import AccountFormContent from './AccountFormContent';
import UserFormFields, { UserFormState } from './UserFormFields';
import usePageTitle from '../usePageTitle';
import { EditUserQueryDocument } from './queries.generated';
import humanize from '../humanize';
import PasswordInputWithStrengthCheck from './PasswordInputWithStrengthCheck';
import { Route } from './+types/EditUser';
import { Form } from 'react-router';
import { getBackendBaseUrl } from 'getBackendBaseUrl';

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const tokens = await context.authenticityTokensManager.getTokens();
  const url = new URL('/users', getBackendBaseUrl());

  const response = await fetch(url, {
    method: 'PATCH',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Cookie: request.headers.get('cookie') ?? '',
      'X-CSRF-Token': tokens.updateUser ?? '',
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    if (responseJson.errors) {
      return new Error(
        Object.entries(responseJson.errors)
          .map(([key, error]) => `${humanize(key)} ${error}`)
          .join(', '),
      );
    }

    return new Error(responseJson.error);
  }

  await context.client.resetStore();

  return redirect('/');
}

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: EditUserQueryDocument });
  return data;
}

function EditUserForm({
  loaderData: { currentUser: initialFormState },
  actionData: updateUserError,
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<UserFormState | undefined>(initialFormState ?? undefined);
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const passwordFieldId = useId();
  usePageTitle('Update Your Account');

  if (!formState) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1 className="mb-4">{t('authentication.editUser.header')}</h1>
      <AccountFormContent />
      <Form method="PATCH" className="card">
        <div className="card-header">{t('authentication.editUser.accountDataHeader')}</div>

        <div className="card-body">
          <UserFormFields formState={formState} setFormState={setFormState} showNameWarning />
          <div className="mb-3">
            <label className="form-label" htmlFor={passwordFieldId}>
              {t('authentication.editUser.passwordLabel')}
            </label>
            <Suspense fallback={<LoadingIndicator />}>
              <PasswordInputWithStrengthCheck
                id={passwordFieldId}
                name="user[password]"
                value={password}
                onChange={setPassword}
              />
            </Suspense>
            <small className="form-text text-muted">{t('authentication.editUser.passwordHelpText')}</small>
          </div>
          <PasswordConfirmationInput
            name="user[password_confirmation]"
            password={password}
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />
          <BootstrapFormInput
            name="user[current_password]"
            label={t('authentication.editUser.currentPasswordLabel')}
            helpText={t('authentication.editUser.currentPasswordHelpText')}
            type="password"
            value={currentPassword}
            onTextChange={setCurrentPassword}
          />

          <ErrorDisplay stringError={updateUserError?.message} />
        </div>

        <div className="card-footer text-end">
          <div>
            <input
              type="submit"
              className="btn btn-primary"
              disabled={navigation.state !== 'idle'}
              value={t('authentication.editUser.updateAccountButton').toString()}
              aria-label={t('authentication.editUser.updateAccountButton')}
            />
          </div>
        </div>
      </Form>
    </>
  );
}

export default EditUserForm;

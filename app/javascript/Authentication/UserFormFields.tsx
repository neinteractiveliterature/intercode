import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BootstrapFormInput, usePropertySetters } from '@neinteractiveliterature/litform';

export type UserFormState = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
};

export type UserFormFieldsProps = {
  formState: UserFormState;
  setFormState: React.Dispatch<React.SetStateAction<UserFormState>>;
  showNameWarning?: boolean;
};

function UserFormFields({ formState, setFormState, showNameWarning }: UserFormFieldsProps) {
  const { t } = useTranslation();
  const [setFirstName, setLastName, setEmail] = usePropertySetters(
    setFormState,
    'first_name',
    'last_name',
    'email',
  );

  return (
    <>
      <fieldset>
        <BootstrapFormInput
          label={t('authentication.userForm.firstNameLabel', 'First name')}
          value={formState.first_name ?? ''}
          onTextChange={setFirstName}
        />
        <BootstrapFormInput
          label={t('authentication.userForm.lastNameLabel', 'Last name')}
          value={formState.last_name ?? ''}
          onTextChange={setLastName}
        />
        {showNameWarning && (
          <div className="alert alert-warning">
            <div className="d-flex align-items-center">
              <h1 className="me-4">
                <i className="bi-exclamation-triangle-fill" />
              </h1>
              <div className="flex-grow-1">
                {t(
                  'authentication.userForm.nameWarning',
                  'Please note that each convention keeps a separate record of your name.  Changing your name here will apply to new conventions you sign up for in the future.  To change your name on existing conventions, please go to each convention’s web site and choose “my profile” from the menu.',
                )}
              </div>
            </div>
          </div>
        )}
        <BootstrapFormInput
          label={t('authentication.userForm.emailLabel', 'Email')}
          type="email"
          value={formState.email ?? ''}
          onTextChange={setEmail}
        />
      </fieldset>
    </>
  );
}

export default UserFormFields;

import React from 'react';
import { useTranslation } from 'react-i18next';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import useStatePropertyUpdater from '../useStatePropertyUpdater';

export type UserFormState = {
  first_name?: string,
  last_name?: string,
  email?: string,
};

export type UserFormFieldsProps = {
  formState: UserFormState,
  setFormState: React.Dispatch<React.SetStateAction<UserFormState>>,
  showNameWarning?: boolean,
};

function UserFormFields({ formState, setFormState, showNameWarning }: UserFormFieldsProps) {
  const { t } = useTranslation();
  const setFormField = useStatePropertyUpdater(setFormState);

  return (
    <>
      <fieldset>
        <BootstrapFormInput
          label={t('authentication.userForm.firstNameLabel', 'First name')}
          value={formState.first_name || ''}
          onTextChange={setFormField('first_name')}
        />
        <BootstrapFormInput
          label={t('authentication.userForm.lastNameLabel', 'Last name')}
          value={formState.last_name || ''}
          onTextChange={setFormField('last_name')}
        />
        {showNameWarning && (
          <div className="alert alert-warning">
            <div className="d-flex align-items-center">
              <h1 className="mr-4">
                <i className="fa fa-exclamation-triangle" />
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
          value={formState.email || ''}
          onTextChange={setFormField('email')}
        />
      </fieldset>
    </>
  );
}

export default UserFormFields;

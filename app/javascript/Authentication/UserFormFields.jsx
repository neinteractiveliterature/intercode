import React from 'react';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import useStatePropertyUpdater from '../useStatePropertyUpdater';

function UserFormFields({ formState, setFormState, showNameWarning }) {
  const setFormField = useStatePropertyUpdater(setFormState);

  return (
    <>
      <fieldset>
        <BootstrapFormInput
          label="First name"
          value={formState.first_name || ''}
          onTextChange={setFormField('first_name')}
        />
        <BootstrapFormInput
          label="Last name"
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
                Please note that each convention keeps a separate record of your name.  Changing
                {' '}
                your name here will apply to new conventions you sign up for in the future.  To
                {' '}
                change your name on existing conventions, please go to each convention&rsquo;s
                {' '}
                web site and choose &ldquo;my profile&rdquo; from the menu.
              </div>
            </div>
          </div>
        )}
        <BootstrapFormInput
          label="Email"
          type="email"
          value={formState.email || ''}
          onTextChange={setFormField('email')}
        />
      </fieldset>
    </>
  );
}

export default UserFormFields;

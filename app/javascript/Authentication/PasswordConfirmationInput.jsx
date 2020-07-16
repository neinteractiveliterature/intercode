import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

function PasswordConfirmationInput({ value, onChange, password }) {
  const { t } = useTranslation();
  const [interactedWithConfirmation, setInteractedWithConfirmation] = useState(false);

  const confirmationInvalid = (
    (interactedWithConfirmation || value.length >= password.length)
    && value !== password
  );

  return (
    <BootstrapFormInput
      type="password"
      label={t('authentication.confirmPasswordLabel', 'Confirm password')}
      className={classNames('form-control', { 'is-invalid': confirmationInvalid })}
      value={value}
      onTextChange={onChange}
      onBlur={() => { setInteractedWithConfirmation(true); }}
    />
  );
}

PasswordConfirmationInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
};

export default PasswordConfirmationInput;

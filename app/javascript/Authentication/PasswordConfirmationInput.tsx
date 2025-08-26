import { useState } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { BootstrapFormInput } from '@neinteractiveliterature/litform';

export type PasswordConfirmationInputProps = {
  value: string;
  onChange: React.Dispatch<string>;
  password: string;
};

function PasswordConfirmationInput({ value, onChange, password }: PasswordConfirmationInputProps): React.JSX.Element {
  const { t } = useTranslation();
  const [interactedWithConfirmation, setInteractedWithConfirmation] = useState(false);

  const confirmationInvalid = (interactedWithConfirmation || value.length >= password.length) && value !== password;

  return (
    <BootstrapFormInput
      type="password"
      label={t('authentication.confirmPasswordLabel')}
      className={classNames('form-control', { 'is-invalid': confirmationInvalid })}
      value={value}
      onTextChange={onChange}
      onBlur={() => {
        setInteractedWithConfirmation(true);
      }}
    />
  );
}

export default PasswordConfirmationInput;

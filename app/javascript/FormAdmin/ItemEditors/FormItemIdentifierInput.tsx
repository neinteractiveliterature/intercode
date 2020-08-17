import React, { useMemo } from 'react';
import classNames from 'classnames';
import { pluralize } from 'inflected';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { FormEditorContextValue } from '../FormEditorContexts';

export type FormItemIdentifierInputProps = {
  formType: FormEditorContextValue['formType'];
  value: string | undefined;
  onChange: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function FormItemIdentifierInput({ formType, value, onChange }: FormItemIdentifierInputProps) {
  const standardItems = formType.standard_items || {};
  const standardIdentifiers = useMemo(
    () => Object.entries(standardItems).map(([identifier]) => identifier),
    [standardItems],
  );

  const normalizedIdentifier = value ?? '';
  const identifierIsReserved = standardIdentifiers.includes(normalizedIdentifier.toLowerCase());

  return (
    <BootstrapFormInput
      label="Identifier"
      className={classNames('form-control', {
        'is-invalid': identifierIsReserved,
      })}
      invalidFeedback={
        identifierIsReserved && (
          <>
            <i className="fa fa-warning" /> “{normalizedIdentifier}” is a reserved identifier in{' '}
            {pluralize(formType.description)}
          </>
        )
      }
      helpText={`An identifier is a short name for your custom form items.  It should contain only lowercase
        letters, digits, and underscores (_).  It must be unique across all items in this form.`}
      value={value}
      onTextChange={onChange}
    />
  );
}

export default FormItemIdentifierInput;

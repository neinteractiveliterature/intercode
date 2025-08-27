import { useMemo } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { BootstrapFormInput } from '@neinteractiveliterature/litform';

import { FormEditorContextValue } from '../FormEditorContexts';

export type FormItemIdentifierInputProps = {
  formType: FormEditorContextValue['formType'];
  value: string | undefined;
  onChange: React.Dispatch<string | undefined>;
};

function FormItemIdentifierInput({ formType, value, onChange }: FormItemIdentifierInputProps): React.JSX.Element {
  const standardIdentifiers = useMemo(() => {
    const standardItems = formType.standard_items || {};
    return Object.entries(standardItems).map(([identifier]) => identifier);
  }, [formType.standard_items]);

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
            <i className="bi-exclamation-triangle-fill" /> “{normalizedIdentifier}” is a reserved identifier in{' '}
            {formType.description} forms
          </>
        )
      }
      helpText={`An identifier is a short name for your custom form items.  It should contain only lowercase
        letters, digits, and underscores (_).  It must be unique across all items in this form.`}
      value={normalizedIdentifier}
      onTextChange={onChange}
    />
  );
}

export default FormItemIdentifierInput;

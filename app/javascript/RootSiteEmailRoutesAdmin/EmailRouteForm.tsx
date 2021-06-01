import * as React from 'react';
import { BootstrapFormInput } from '@neinteractiveliterature/litform';

import { StringArrayEditor } from '../BuiltInFormControls/ArrayEditor';
import { EmailRoute } from '../graphqlTypes.generated';

export type EmailRouteFormProps = {
  emailRoute: EmailRoute;
  onChange: React.Dispatch<EmailRoute>;
};

function EmailRouteForm({ emailRoute, onChange }: EmailRouteFormProps) {
  const changeField = <F extends keyof EmailRoute>(field: F) => (value: EmailRoute[F]) =>
    onChange({ ...emailRoute, [field]: value });

  return (
    <>
      <BootstrapFormInput
        label="Receiver email"
        value={emailRoute.receiver_address}
        onTextChange={changeField('receiver_address')}
      />

      <StringArrayEditor
        array={emailRoute.forward_addresses ?? []}
        onChange={changeField('forward_addresses')}
        header="Forward addresses"
        renderValue={(value) => value}
        getDeleteButtonLabel={(value) => `Delete forward address ${value}`}
        getDeletePrompt={(value) =>
          `Are you sure you want to delete ${value} from the forward addresses?`
        }
        renderAddValueInput={({ value, onChange: onAddValueChange, onKeyDown }) => (
          <input
            type="email"
            className="form-control"
            value={value}
            onChange={(event) => onAddValueChange(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Forward address to add"
          />
        )}
        addValueLabel="Add forward address"
      />
    </>
  );
}

export default EmailRouteForm;

import * as React from 'react';
import { BootstrapFormInput } from '@neinteractiveliterature/litform';

import { StringArrayEditor } from '../BuiltInFormControls/ArrayEditor';
import { usePropertySetters } from '@neinteractiveliterature/litform/dist/types/usePropertySetters';
import { EmailRouteFieldsFragment } from './queries.generated';

export type EmailRouteFormProps = {
  emailRoute: EmailRouteFieldsFragment;
  onChange: React.Dispatch<React.SetStateAction<EmailRouteFieldsFragment>>;
};

function EmailRouteForm({ emailRoute, onChange }: EmailRouteFormProps): JSX.Element {
  const [setReceiverAddress, setForwardAddresses] = usePropertySetters(
    onChange,
    'receiver_address',
    'forward_addresses',
  );

  return (
    <>
      <BootstrapFormInput
        label="Receiver email"
        value={emailRoute.receiver_address}
        onTextChange={setReceiverAddress}
      />

      <StringArrayEditor
        array={emailRoute.forward_addresses ?? []}
        onChange={setForwardAddresses}
        header="Forward addresses"
        renderValue={(value) => value}
        getDeleteButtonLabel={(value) => `Delete forward address ${value}`}
        getDeletePrompt={(value) => `Are you sure you want to delete ${value} from the forward addresses?`}
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

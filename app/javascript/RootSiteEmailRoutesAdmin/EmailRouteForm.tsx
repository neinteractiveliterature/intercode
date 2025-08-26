import * as React from 'react';
import { BootstrapFormInput } from '@neinteractiveliterature/litform';

import { StringArrayEditor } from '../BuiltInFormControls/ArrayEditor';
import { usePropertySetters } from '@neinteractiveliterature/litform';
import { EmailRouteFieldsFragment } from './queries.generated';
import { useTranslation } from 'react-i18next';

export type EmailRouteFormProps = {
  emailRoute: EmailRouteFieldsFragment;
  onChange: React.Dispatch<React.SetStateAction<EmailRouteFieldsFragment>>;
};

function EmailRouteForm({ emailRoute, onChange }: EmailRouteFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const [setReceiverAddress, setForwardAddresses] = usePropertySetters(
    onChange,
    'receiver_address',
    'forward_addresses',
  );

  return (
    <>
      <BootstrapFormInput
        label={t('admin.emailRoutes.newEmailRoute.receiverEmailLabel')}
        value={emailRoute.receiver_address}
        onTextChange={setReceiverAddress}
      />

      <StringArrayEditor
        array={emailRoute.forward_addresses ?? []}
        onChange={setForwardAddresses}
        header={t('admin.emailRoutes.newEmailRoute.forwardAddressesLabel')}
        renderValue={(value) => value}
        getDeleteButtonLabel={(email) => t('admin.emailRoutes.newEmailRoute.forwardAddressesDeleteButton', { email })}
        getDeletePrompt={(email) => t('admin.emailRoutes.newEmailRoute.forwardAddressesDeletePrompt', { email })}
        renderAddValueInput={({ value, onChange: onAddValueChange, onKeyDown }) => (
          <input
            type="email"
            className="form-control"
            value={value}
            onChange={(event) => onAddValueChange(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label={t('admin.emailRoutes.newEmailRoute.forwardAddressesAddLabel')}
          />
        )}
        addValueLabel={t('admin.emailRoutes.newEmailRoute.forwardAddressesAddButton')}
      />
    </>
  );
}

export default EmailRouteForm;

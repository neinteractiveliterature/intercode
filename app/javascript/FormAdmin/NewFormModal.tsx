import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useFetcher } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { BootstrapFormInput, BootstrapFormSelect, ErrorDisplay } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import FormTypes from '../../../config/form_types.json';
import { FormType } from '../graphqlTypes.generated';

export type NewFormModalProps = {
  visible: boolean;
  close: () => void;
};

function NewFormModal({ visible, close }: NewFormModalProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [formType, setFormType] = useState<FormType>();
  const fetcher = useFetcher();

  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="POST" action="/admin_forms?index">
      <Modal visible={visible}>
        <div className="modal-header">New form</div>

        <div className="modal-body">
          <BootstrapFormInput label="Title" name="title" value={title} onTextChange={setTitle} disabled={inProgress} />

          <BootstrapFormSelect
            label="Form type"
            name="form_type"
            value={formType}
            onValueChange={(newValue) => setFormType(newValue as FormType)}
            disabled={inProgress}
          >
            <option value="">Select a form type...</option>
            {Object.entries(FormTypes).map(([value, ft]) => (
              <option value={value} key={value}>
                {capitalize(ft.description)}
              </option>
            ))}
          </BootstrapFormSelect>

          <ErrorDisplay graphQLError={error as ApolloError} />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={close} disabled={inProgress}>
            Cancel
          </button>
          <button type="submit" disabled={!formType || !title || inProgress} className="btn btn-primary">
            Create form
          </button>
        </div>
      </Modal>
    </fetcher.Form>
  );
}

export default NewFormModal;

import { useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap4-modal';
// @ts-expect-error
import { capitalize } from 'inflected';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  BootstrapFormInput,
  BootstrapFormSelect,
  ErrorDisplay,
} from '@neinteractiveliterature/litform';

import { CreateForm } from './mutations';
import { FormAdminQuery } from './queries';
import FormTypes from '../../../config/form_types.json';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';
import { FormAdminQueryData, FormAdminQueryVariables } from './queries.generated';
import { CreateFormMutationData, CreateFormMutationVariables } from './mutations.generated';

export type NewFormModalProps = {
  visible: boolean;
  close: () => void;
};

function NewFormModal({ visible, close }: NewFormModalProps) {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [formType, setFormType] = useState('');
  const createFormMutate = useCreateMutation<
    FormAdminQueryData,
    FormAdminQueryVariables,
    CreateFormMutationVariables,
    CreateFormMutationData
  >(CreateForm, {
    query: FormAdminQuery,
    arrayPath: ['convention', 'forms'],
    newObjectPath: ['createForm', 'form'],
  });

  const createForm = useCallback(
    async ({ title: t, formType: ft }) => {
      const { data } = await createFormMutate({
        variables: { form: { title: t }, formType: ft },
      });
      const form = data?.createForm?.form;
      if (form) {
        history.push(`/admin_forms/${form.id}/edit`);
      }
    },
    [createFormMutate, history],
  );
  const [createFormClicked, error, inProgress] = useAsyncFunction(createForm);

  return (
    <Modal visible={visible}>
      <div className="modal-header">New form</div>

      <div className="modal-body">
        <BootstrapFormInput
          label="Title"
          name="title"
          value={title}
          onTextChange={setTitle}
          disabled={inProgress}
        />

        <BootstrapFormSelect
          label="Form type"
          name="form_type"
          value={formType}
          onValueChange={setFormType}
          disabled={inProgress}
        >
          <option disabled value="">
            Select a form type...
          </option>
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
        <button
          type="button"
          disabled={!formType || !title || inProgress}
          className="btn btn-primary"
          onClick={() => createFormClicked({ title, formType })}
        >
          Create form
        </button>
      </div>
    </Modal>
  );
}

export default NewFormModal;

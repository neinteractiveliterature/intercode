import { useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  BootstrapFormInput,
  BootstrapFormSelect,
  ErrorDisplay,
  useCreateMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import FormTypes from '../../../config/form_types.json';
import useAsyncFunction from '../useAsyncFunction';
import { FormAdminQueryData, FormFieldsFragmentDoc } from './queries.generated';
import { useCreateFormMutation } from './mutations.generated';
import { CreateFormInput, FormType } from '../graphqlTypes.generated';

export type NewFormModalProps = {
  convention: FormAdminQueryData['convention'];
  visible: boolean;
  close: () => void;
};

function NewFormModal({ convention, visible, close }: NewFormModalProps): JSX.Element {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [formType, setFormType] = useState<FormType>();
  const [createFormMutate] = useCreateMutationWithReferenceArrayUpdater(
    useCreateFormMutation,
    convention,
    'forms',
    (data) => data.createForm.form,
    FormFieldsFragmentDoc,
  );

  const createForm = useCallback(
    async ({
      title: t,
      formType: ft,
    }: {
      title: CreateFormInput['form']['title'];
      formType: CreateFormInput['form_type'];
    }) => {
      const { data } = await createFormMutate({
        variables: { form: { title: t }, formType: ft },
      });
      const form = data?.createForm?.form;
      if (form) {
        navigate(`/admin_forms/${form.id}/edit`);
      }
    },
    [createFormMutate, navigate],
  );
  const [createFormClicked, error, inProgress] = useAsyncFunction(createForm);

  return (
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
          onClick={() => {
            if (formType) {
              createFormClicked({ title, formType });
            }
          }}
        >
          Create form
        </button>
      </div>
    </Modal>
  );
}

export default NewFormModal;

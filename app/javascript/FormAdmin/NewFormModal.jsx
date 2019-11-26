import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { capitalize } from 'inflected';
import { useHistory } from 'react-router-dom';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';
import { CreateForm } from './mutations.gql';
import { FormAdminQuery } from './queries.gql';
import FormTypes from '../../../config/form_types.json';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';

function NewFormModal({ visible, close }) {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [formType, setFormType] = useState('');
  const createFormMutate = useCreateMutation(CreateForm, {
    query: FormAdminQuery,
    arrayPath: ['convention', 'forms'],
    newObjectPath: ['createForm', 'form'],
  });

  const createForm = useCallback(
    async ({ title: t, formType: ft }) => {
      const { data } = await createFormMutate({
        variables: { form: { title: t }, formType: ft },
      });
      history.push(`/admin_forms/${data.createForm.form.id}/edit`);
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
          <option disabled value="">Select a form type...</option>
          {Object.entries(FormTypes).map(([value, ft]) => (
            <option value={value} key={value}>{capitalize(ft.description)}</option>
          ))}
        </BootstrapFormSelect>

        <ErrorDisplay graphQLError={error} />
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={close}
          disabled={inProgress}
        >
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

NewFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default NewFormModal;

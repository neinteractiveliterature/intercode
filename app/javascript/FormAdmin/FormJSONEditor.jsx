import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import CodeInput from '../BuiltInFormControls/CodeInput';
import { CreateFormWithJSON, UpdateFormWithJSON } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { FormAdminQuery } from './queries.gql';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';
import usePageTitle from '../usePageTitle';
import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';

function formDataFromJSON(json) {
  const { title, sections } = JSON.parse(json);
  return {
    title,
    sectionsJSON: JSON.stringify(sections, null, '  '),
  };
}

function FormJSONEditor({ initialForm }) {
  const history = useHistory();
  const initialFormData = useMemo(
    () => formDataFromJSON(initialForm.export_json),
    [initialForm.export_json],
  );
  const [form, setForm] = useState(initialFormData);
  const [createForm, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateFormWithJSON, {
      query: FormAdminQuery,
      arrayPath: ['convention', 'forms'],
      newObjectPath: ['createFormWithJSON', 'form'],
    }),
  );
  const [updateMutate] = useMutation(UpdateFormWithJSON);
  const [updateForm, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  usePageTitle(initialForm.id ? `Editing “${initialFormData.title}”` : 'New Form');

  const save = async () => {
    const formJSON = JSON.stringify({
      title: form.title,
      sections: JSON.parse(form.sectionsJSON),
    });

    if (initialForm.id) {
      await updateForm({
        variables: {
          id: initialForm.id,
          formJSON,
        },
      });
    } else {
      await createForm({ variables: { formJSON, formType: form.form_type } });
    }
    history.push('/admin_forms');
  };

  return (
    <div>
      <h1 className="mb-4">
        {
          initialForm.id
            ? `Editing ${form.title}`
            : 'New form'
        }
      </h1>

      <BootstrapFormInput
        label="Title"
        name="title"
        value={form.title}
        onTextChange={(title) => setForm((prevForm) => ({ ...prevForm, title }))}
      />

      <BootstrapFormSelect
        label="Form type"
        name="form_type"
        value={form.form_type}
        onValueChange={(formType) => setForm((prevForm) => ({ ...prevForm, form_type: formType }))}
        disabled={initialForm.id != null}
      >
        <option disabled selected={form.form_type == null}>Select a form type...</option>
        <option value="event">Event form</option>
        <option value="event_proposal">Event proposal form</option>
        <option value="user_con_profile">User con profile form</option>
      </BootstrapFormSelect>

      <fieldset className="mb-4">
        <legend className="col-form-label">Content</legend>
        <CodeInput
          value={form.sectionsJSON}
          mode="application/json"
          onChange={(sectionsJSON) => setForm((prevForm) => ({ ...prevForm, sectionsJSON }))}
        />
      </fieldset>

      <div className="mb-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={save}
          disabled={createInProgress || updateInProgress}
        >
          Save changes
        </button>
      </div>

      <ErrorDisplay graphQLError={createError || updateError} />
    </div>
  );
}

FormJSONEditor.propTypes = {
  initialForm: PropTypes.shape({
    id: PropTypes.number,
    export_json: PropTypes.string.isRequired,
  }).isRequired,
};

export default FormJSONEditor;

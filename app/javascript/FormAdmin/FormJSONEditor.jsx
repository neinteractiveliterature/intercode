import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import CodeInput from '../BuiltInFormControls/CodeInput';
import { CreateFormWithJSON, UpdateFormWithJSON } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { FormAdminQuery } from './queries.gql';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';
import useMutationCallback from '../useMutationCallback';
import usePageTitle from '../usePageTitle';

function formDataFromJSON(json) {
  const { title, sections } = JSON.parse(json);
  return {
    title,
    sectionsJSON: JSON.stringify(sections, null, '  '),
  };
}

function FormJSONEditor({ initialForm, history }) {
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
  const [updateForm, updateError, updateInProgress] = useAsyncFunction(
    useMutationCallback(UpdateFormWithJSON),
  );

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
      await createForm({ variables: { formJSON } });
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
        onTextChange={title => setForm(prevForm => ({ ...prevForm, title }))}
      />

      <fieldset className="mb-4">
        <legend className="col-form-label">Content</legend>
        <CodeInput
          value={form.sectionsJSON}
          mode="application/json"
          onChange={sectionsJSON => setForm(prevForm => ({ ...prevForm, sectionsJSON }))}
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default FormJSONEditor;

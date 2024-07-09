import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  BootstrapFormInput,
  ErrorDisplay,
  BootstrapFormSelect,
  CodeInput,
  useStandardCodeMirror,
  useCreateMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import { json as jsonExtension } from '@codemirror/lang-json';

import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { FormFieldsFragmentDoc, useFormAdminQuery } from './queries.generated';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { useCreateFormWithJsonMutation, useUpdateFormWithJsonMutation } from './mutations.generated';
import { FormType } from '../graphqlTypes.generated';

type EditingFormJSONData = {
  title: string;
  sectionsJSON: string;
  form_type?: string;
};

function formDataFromJSON(json: string): EditingFormJSONData {
  const { title, sections, form_type } = JSON.parse(json) as {
    title: string;
    sections: unknown;
    form_type?: string;
  };
  return {
    title,
    sectionsJSON: JSON.stringify(sections, null, '  '),
    form_type,
  };
}

export default LoadSingleValueFromCollectionWrapper(
  useFormAdminQuery,
  (data, id) => data.convention.forms.find((form) => form.id === id),
  function FormJSONEditor({ value: initialForm, data }) {
    const navigate = useNavigate();
    const initialFormData = useMemo(() => formDataFromJSON(initialForm.export_json), [initialForm.export_json]);
    const [form, setForm] = useState(initialFormData);
    const [createForm, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
      useCreateFormWithJsonMutation,
      data.convention,
      'forms',
      (data) => data.createFormWithJSON.form,
      FormFieldsFragmentDoc,
    );
    const [updateMutate] = useUpdateFormWithJsonMutation();
    const [updateForm, updateError, updateInProgress] = useAsyncFunction(updateMutate);
    const { t } = useTranslation();

    const extensions = useMemo(() => [jsonExtension()], []);
    const onChange = useCallback((sectionsJSON: string) => setForm((prevForm) => ({ ...prevForm, sectionsJSON })), []);
    const [editorRef] = useStandardCodeMirror({ extensions, value: form.sectionsJSON, onChange });

    usePageTitle(initialForm.id ? `Editing “${initialFormData.title}”` : 'New Form');

    const save = async () => {
      const formType = form.form_type as FormType;
      if (!formType) {
        throw new Error('Please select a form type.');
      }

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
        await createForm({ variables: { formJSON, formType } });
      }
      navigate('/admin_forms');
    };

    return (
      <div>
        <h1 className="mb-4">{initialForm.id ? `Editing ${form.title}` : 'New form'}</h1>
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
          <option disabled selected={form.form_type == null}>
            Select a form type...
          </option>
          <option value="event">Event form</option>
          <option value="event_proposal">Event proposal form</option>
          <option value="user_con_profile">User con profile form</option>
        </BootstrapFormSelect>
        <fieldset className="mb-4">
          <legend className="col-form-label">Content</legend>
          <CodeInput
            editorRef={editorRef}
            value={form.sectionsJSON}
            editButtonText={t('buttons.edit')}
            previewButtonText={t('buttons.preview')}
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
        <ErrorDisplay graphQLError={(createError ?? updateError) as ApolloError | undefined} />
      </div>
    );
  },
);

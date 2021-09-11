import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  BootstrapFormInput,
  ErrorDisplay,
  BootstrapFormSelect,
  CodeInput,
} from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import { json as jsonExtension } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';

import { CreateFormWithJSON } from './mutations';
import { FormAdminQuery } from './queries';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';
import usePageTitle from '../usePageTitle';
import { useFormAdminQuery } from './queries.generated';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { useUpdateFormWithJsonMutation } from './mutations.generated';
import intercodeTheme, {
  intercodeHighlightStyle,
} from '../BuiltInFormControls/IntercodeCodemirrorTheme';

type EditingFormJSONData = {
  title: string;
  sectionsJSON: string;
  form_type?: string;
};

function formDataFromJSON(json: string): EditingFormJSONData {
  const { title, sections } = JSON.parse(json) as { title: string; sections: any };
  return {
    title,
    sectionsJSON: JSON.stringify(sections, null, '  '),
  };
}

export default LoadSingleValueFromCollectionWrapper(
  useFormAdminQuery,
  (data, id) => data.convention.forms.find((form) => form.id.toString(10) === id),
  function FormJSONEditor({ value: initialForm }) {
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
    const [updateMutate] = useUpdateFormWithJsonMutation();
    const [updateForm, updateError, updateInProgress] = useAsyncFunction(updateMutate);
    const { t } = useTranslation();

    const extensions = useMemo(
      () => [jsonExtension(), intercodeTheme, intercodeHighlightStyle, EditorView.lineWrapping],
      [],
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
        await createForm({ variables: { formJSON, formType: form.form_type } });
      }
      history.push('/admin_forms');
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
          onValueChange={(formType) =>
            setForm((prevForm) => ({ ...prevForm, form_type: formType }))
          }
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
            value={form.sectionsJSON}
            extensions={extensions}
            onChange={(sectionsJSON) => setForm((prevForm) => ({ ...prevForm, sectionsJSON }))}
            editButtonText={t('buttons.edit', 'Edit')}
            previewButtonText={t('buttons.preview', 'Preview')}
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

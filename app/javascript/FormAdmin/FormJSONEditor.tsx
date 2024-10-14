import { useCallback, useMemo, useState } from 'react';
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from 'react-router';
import { ApolloError } from '@apollo/client';
import {
  BootstrapFormInput,
  ErrorDisplay,
  BootstrapFormSelect,
  CodeInput,
  useStandardCodeMirror,
} from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import { json as jsonExtension } from '@codemirror/lang-json';

import usePageTitle from '../usePageTitle';
import { FormAdminQueryData, FormAdminQueryDocument } from './queries.generated';
import { FormType } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';
import { CreateFormWithJsonDocument, UpdateFormWithJsonDocument } from './mutations.generated';
import invariant from 'tiny-invariant';

function parseFormData(formData: FormData) {
  const formJSON = JSON.stringify({
    title: formData.get('title'),
    sections: JSON.parse(formData.get('sections_json')?.toString() ?? ''),
  });

  return formJSON;
}

export const action: ActionFunction = async ({ request, params }) => {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const formType = formData.get('form_type')?.toString() as FormType;
      if (!formType) {
        throw new Error('Please select a form type.');
      }
      const formJSON = parseFormData(await request.formData());

      await client.mutate({
        mutation: CreateFormWithJsonDocument,
        variables: { formType, formJSON },
        refetchQueries: [{ query: FormAdminQueryDocument }],
        awaitRefetchQueries: true,
      });
      return redirect('/admin_forms');
    } else if (request.method === 'PATCH') {
      const id = params.id;
      invariant(id != null);

      const formJSON = parseFormData(await request.formData());
      await client.mutate({
        mutation: UpdateFormWithJsonDocument,
        variables: { id, formJSON },
        refetchQueries: [{ query: FormAdminQueryDocument }],
        awaitRefetchQueries: true,
      });
      return redirect('/admin_forms');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

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

type LoaderResult = {
  initialForm: FormAdminQueryData['convention']['forms'][number];
  data: FormAdminQueryData;
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<FormAdminQueryData>({ query: FormAdminQueryDocument });
  const initialForm = data.convention.forms.find((form) => form.id === id);
  if (!initialForm) {
    throw new Response(null, { status: 404 });
  }
  return { data, initialForm } satisfies LoaderResult;
};

function FormJSONEditor() {
  const { initialForm } = useLoaderData() as LoaderResult;
  const initialFormData = useMemo(() => formDataFromJSON(initialForm.export_json), [initialForm.export_json]);
  const [form, setForm] = useState(initialFormData);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const error = useActionData();

  const extensions = useMemo(() => [jsonExtension()], []);
  const onChange = useCallback((sectionsJSON: string) => setForm((prevForm) => ({ ...prevForm, sectionsJSON })), []);
  const [editorRef] = useStandardCodeMirror({ extensions, value: form.sectionsJSON, onChange });

  usePageTitle(initialForm.id ? `Editing “${initialFormData.title}”` : 'New Form');

  return (
    <Form method={initialForm.id ? 'PATCH' : 'POST'}>
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
        <input type="hidden" name="sections_json" value={form.sectionsJSON} />
      </fieldset>
      <div className="mb-4">
        <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
          Save changes
        </button>
      </div>
      <ErrorDisplay graphQLError={error as ApolloError | undefined} />
    </Form>
  );
}

export const Component = FormJSONEditor;

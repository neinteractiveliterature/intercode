import { useMemo } from 'react';
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  Navigate,
  Outlet,
  useFetcher,
  useLoaderData,
  useParams,
} from 'react-router';
import sortBy from 'lodash/sortBy';
import flatMap from 'lodash/flatMap';
import { notEmpty } from '@neinteractiveliterature/litform';

import { FormEditorContext, FormEditorForm } from './FormEditorContexts';
import FormTypes from '../../../config/form_types.json';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { parseTypedFormItemObject } from './FormItemUtils';
import usePageTitle from '../usePageTitle';
import { FormEditorQueryData, FormEditorQueryDocument, FormEditorQueryVariables } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { client } from '../useIntercodeApolloClient';
import { UpdateFormDocument } from './mutations.generated';
import styles from 'styles/form_editor.module.scss';

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<FormEditorQueryData, FormEditorQueryVariables>({
    query: FormEditorQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    const formData = await request.formData();
    const { data } = await client.mutate({
      mutation: UpdateFormDocument,
      variables: { id: id ?? '', form: { title: formData.get('title')?.toString() } },
    });
    return json(data);
  } catch (error) {
    return error;
  }
};

function FormEditor(): JSX.Element {
  const params = useParams<{ id: string; sectionId?: string; itemId?: string }>();
  if (params.id == null) {
    throw new Error('id not found in URL params');
  }
  const { t } = useTranslation();
  const data = useLoaderData() as FormEditorQueryData;
  const fetcher = useFetcher();

  const form: FormEditorForm = useMemo(() => {
    return {
      ...data.convention.form,
      form_sections: sortBy(data.convention.form.form_sections, 'position').map((formSection) => ({
        ...formSection,
        form_items: sortBy(formSection.form_items, 'position').map(parseTypedFormItemObject).filter(notEmpty),
      })),
    };
  }, [data]);

  const formItemsById = useMemo(
    () =>
      new Map(
        flatMap(form.form_sections, (formSection) => formSection.form_items.map((formItem) => [formItem.id, formItem])),
      ),
    [form],
  );

  const updateFormTitle = (title: string) => fetcher.submit({ title }, { action: '.', method: 'PATCH' });

  usePageTitle(`Editing “${form.title}”`);

  let currentSection: FormEditorForm['form_sections'][0] | undefined;

  if (!params.sectionId) {
    const firstSection = form.form_sections[0];
    if (firstSection) {
      return <Navigate to={`/admin_forms/${params.id}/edit/section/${firstSection.id}`} />;
    }
  } else {
    currentSection = form.form_sections.find((formSection) => formSection.id.toString() === params.sectionId);
  }

  const { convention } = data;
  const formType = FormTypes[form.form_type] || {};

  return (
    <div className={`form-editor ${styles.formEditor}`}>
      <div className={`form-editor-top-navbar ${styles.formEditorTopNavbar} px-2 navbar navbar-light bg-warning-light`}>
        {params.itemId && currentSection ? (
          <Link to={`/admin_forms/${form.id}/edit/section/${currentSection.id}`} className="btn btn-secondary">
            <i className="bi-chevron-left" />
            {t('admin.forms.backToSection')}
          </Link>
        ) : (
          <Link to="/admin_forms" className="btn btn-secondary">
            <i className="bi-chevron-left" />
            {t('admin.forms.backToForms')}
          </Link>
        )}
        <div className="flex-grow-1 ms-2">
          <InPlaceEditor className="d-flex align-items-start w-100" value={form.title} onChange={updateFormTitle}>
            <div className="navbar-brand">{form.title}</div>
          </InPlaceEditor>
        </div>
      </div>

      <FormEditorContext.Provider
        value={{
          convention,
          currentSection,
          form,
          formTypeIdentifier: form.form_type,
          formType,
          formItemsById,
        }}
      >
        <Outlet />
      </FormEditorContext.Provider>
    </div>
  );
}

export default FormEditor;

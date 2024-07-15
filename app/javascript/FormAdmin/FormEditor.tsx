import { useMemo } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import flatMap from 'lodash/flatMap';
import { notEmpty, ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { FormEditorContext, FormEditorForm } from './FormEditorContexts';
import FormItemEditorLayout from './FormItemEditorLayout';
import FormSectionEditorLayout from './FormSectionEditorLayout';
import FormTypes from '../../../config/form_types.json';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { parseTypedFormItemObject } from './FormItemUtils';
import usePageTitle from '../usePageTitle';
import { useFormEditorQuery } from './queries.generated';
import { FormType } from '../graphqlTypes.generated';
import { useUpdateFormMutation } from './mutations.generated';
import FourOhFourPage from '../FourOhFourPage';
import { useTranslation } from 'react-i18next';

function FormEditor(): JSX.Element {
  const params = useParams<{ id: string; sectionId?: string; itemId?: string }>();
  if (params.id == null) {
    throw new Error('id not found in URL params');
  }
  const { t } = useTranslation();
  const { data, error, loading } = useFormEditorQuery({
    variables: {
      id: params.id,
    },
  });
  const [updateForm] = useUpdateFormMutation();

  const form: FormEditorForm = useMemo(() => {
    if (loading || error || !data) {
      return {
        __typename: 'Form',
        id: '',
        form_type: FormType.Event,
        title: '',
        form_sections: [],
      };
    }

    return {
      ...data.convention.form,
      form_sections: sortBy(data.convention.form.form_sections, 'position').map((formSection) => ({
        ...formSection,
        form_items: sortBy(formSection.form_items, 'position').map(parseTypedFormItemObject).filter(notEmpty),
      })),
    };
  }, [data, error, loading]);

  const formItemsById = useMemo(
    () =>
      new Map(
        flatMap(form.form_sections, (formSection) => formSection.form_items.map((formItem) => [formItem.id, formItem])),
      ),
    [form],
  );

  const updateFormTitle = (title: string) => updateForm({ variables: { id: form.id, form: { title } } });

  usePageTitle(form.id ? `Editing “${form.title}”` : 'New Form');

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data) {
    return <FourOhFourPage />;
  }

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
    <div className="form-editor">
      <div className="form-editor-top-navbar px-2 navbar navbar-light bg-warning-light">
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
        <Routes>
          <Route path="section/:sectionId/item/:itemId" element={<FormItemEditorLayout />} />
          <Route path="section/:sectionId" element={<FormSectionEditorLayout />} />
        </Routes>
      </FormEditorContext.Provider>
    </div>
  );
}

export default FormEditor;

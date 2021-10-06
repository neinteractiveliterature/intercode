import { useMemo } from 'react';
import { Link, Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
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

function FormEditor(): JSX.Element {
  const match = useRouteMatch<{ id: string; sectionId?: string; itemId?: string }>();
  const { data, error, loading } = useFormEditorQuery({
    variables: {
      id: match.params.id,
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

  if (!match.params.sectionId) {
    const firstSection = form.form_sections[0];
    if (firstSection) {
      return <Redirect to={`/admin_forms/${match.params.id}/edit/section/${firstSection.id}`} />;
    }
  } else {
    currentSection = form.form_sections.find((formSection) => formSection.id.toString() === match.params.sectionId);
  }

  const { convention } = data;
  const formType = FormTypes[form.form_type] || {};

  return (
    <div className="form-editor">
      <div className="form-editor-top-navbar px-2 navbar navbar-light bg-warning-light">
        {match.params.itemId && currentSection ? (
          <Link to={`/admin_forms/${form.id}/edit/section/${currentSection.id}`} className="btn btn-secondary">
            <i className="bi-chevron-left" /> Back to section
          </Link>
        ) : (
          <Link to="/admin_forms" className="btn btn-secondary">
            <i className="bi-chevron-left" /> Back to forms
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
        <Switch>
          <Route path="/admin_forms/:id/edit/section/:sectionId/item/:itemId">
            <FormItemEditorLayout />
          </Route>
          <Route path="/admin_forms/:id/edit/section/:sectionId">
            <FormSectionEditorLayout />
          </Route>
        </Switch>
      </FormEditorContext.Provider>
    </div>
  );
}

export default FormEditor;

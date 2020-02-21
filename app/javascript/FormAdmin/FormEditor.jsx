import React, { useMemo } from 'react';
import {
  Link, Redirect, Route, Switch, useRouteMatch,
} from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import sortBy from 'lodash/sortBy';
import flatMap from 'lodash/flatMap';

import ErrorDisplay from '../ErrorDisplay';
import { FormEditorContext } from './FormEditorContexts';
import { FormEditorQuery } from './queries.gql';
import FormItemEditorLayout from './FormItemEditorLayout';
import FormSectionEditorLayout from './FormSectionEditorLayout';
import FormTypes from '../../../config/form_types.json';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { parseFormItemObject } from './FormItemUtils';
import { UpdateForm } from './mutations.gql';
import usePageTitle from '../usePageTitle';

function FormEditor() {
  const match = useRouteMatch();
  const { data, error, loading } = useQuery(FormEditorQuery, {
    variables: {
      id: Number.parseInt(match.params.id, 10),
    },
  });
  const [updateForm] = useMutation(UpdateForm);

  const form = useMemo(
    () => {
      if (loading || error) {
        return {};
      }

      return {
        ...data.form,
        form_sections: sortBy(data.form.form_sections, 'position').map((formSection) => ({
          ...formSection,
          form_items: sortBy(formSection.form_items, 'position').map(parseFormItemObject),
        })),
      };
    },
    [data, error, loading],
  );

  const renderedFormItemsById = useMemo(
    () => new Map(flatMap(form.form_sections || [], (formSection) => (
      formSection.form_items.map((formItem) => [
        formItem.id,
        {
          ...formItem,
          properties: formItem.rendered_properties,
        },
      ])))),
    [form],
  );

  const updateFormTitle = (title) => updateForm({ variables: { id: form.id, form: { title } } });

  usePageTitle(form.id ? `Editing “${form.title}”` : 'New Form');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  let currentSection = null;

  if (!match.params.sectionId) {
    const firstSection = form.form_sections[0];
    if (firstSection) {
      return <Redirect to={`/admin_forms/${match.params.id}/edit/section/${firstSection.id}`} />;
    }
  } else {
    currentSection = form.form_sections
      .find((formSection) => formSection.id.toString() === match.params.sectionId);
  }

  const { convention } = data;
  const formType = FormTypes[form.form_type] || {};

  return (
    <div className="form-editor">
      <div className="form-editor-top-navbar navbar navbar-light bg-warning-light">
        {match.params.itemId
          ? (
            <Link
              to={`/admin_forms/${form.id}/edit/section/${currentSection.id}`}
              className="btn btn-secondary"
            >
              <i className="fa fa-chevron-left" />
              {' '}
              Back to section
            </Link>
          )
          : (
            <Link to="/admin_forms" className="btn btn-secondary">
              <i className="fa fa-chevron-left" />
              {' '}
              Back to forms
            </Link>
          )}
        <div className="flex-grow-1 ml-2">
          <InPlaceEditor
            className="d-flex align-items-start w-100"
            value={form.title}
            onChange={updateFormTitle}
          >
            <div className="navbar-brand">{form.title}</div>
          </InPlaceEditor>
        </div>
      </div>

      <FormEditorContext.Provider
        value={{
          convention, currentSection, form, formType, renderedFormItemsById,
        }}
      >
        <Switch>
          <Route
            path="/admin_forms/:id/edit/section/:sectionId/item/:itemId"
            component={FormItemEditorLayout}
          />
          <Route
            path="/admin_forms/:id/edit/section/:sectionId"
            component={FormSectionEditorLayout}
          />
        </Switch>
      </FormEditorContext.Provider>
    </div>
  );
}

export default FormEditor;

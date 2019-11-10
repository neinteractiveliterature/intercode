import React, { useMemo } from 'react';
import {
  Redirect, Route, Switch, useRouteMatch,
} from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import sortBy from 'lodash-es/sortBy';
import flatMap from 'lodash-es/flatMap';

import ErrorDisplay from '../ErrorDisplay';
import { FormEditorContext } from './FormEditorContexts';
import { FormEditorQuery } from './queries.gql';
import FormItemEditorLayout from './FormItemEditorLayout';
import FormSectionEditorLayout from './FormSectionEditorLayout';
import FormTypes from './form_types.json';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { parseFormItemObject } from './FormItemUtils';
import usePageTitle from '../usePageTitle';

function FormEditor() {
  const match = useRouteMatch();
  const { data, error, loading } = useQuery(FormEditorQuery, {
    variables: {
      id: Number.parseInt(match.params.id, 10),
    },
  });

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
    <>
      <h1 className="mb-4">{form.title}</h1>

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
    </>
  );
}

export default FormEditor;

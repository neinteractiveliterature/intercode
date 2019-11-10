import React, { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import sortBy from 'lodash-es/sortBy';

import flatMap from 'lodash-es/flatMap';
import ErrorDisplay from '../ErrorDisplay';
import { FormEditorQuery } from './queries.gql';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { parseFormItemObject } from './FormItemUtils';
import FormSectionEditor from './FormSectionEditor';
import { FormEditorContext } from './FormEditorContexts';
import FormSectionNav from './FormSectionNav';

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

  const { convention } = data;

  return (
    <>
      <h1 className="mb-4">{form.title}</h1>

      <FormEditorContext.Provider value={{ convention, form, renderedFormItemsById }}>
        <div className="row m-0">
          <nav className="col-3 bg-light p-2">
            <FormSectionNav />
          </nav>
          <div className="col p-2 border overflow-auto" style={{ height: '90vh' }}>
            <FormSectionEditor />
          </div>
        </div>
      </FormEditorContext.Provider>
    </>
  );
}

export default FormEditor;

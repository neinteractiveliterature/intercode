import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Prompt, Redirect } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import sortBy from 'lodash-es/sortBy';

import flatMap from 'lodash-es/flatMap';
import ErrorDisplay from '../ErrorDisplay';
import { FormEditorQuery } from './queries.gql';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';
import FormEditorItemPreview from './FormEditorItemPreview';
import FormItemEditor from './FormItemEditor';
import { parseFormItemObject } from './FormItemUtils';

function FormEditor({ match }) {
  const { data, error, loading } = useQuery(FormEditorQuery, {
    variables: {
      id: Number.parseInt(match.params.id, 10),
    },
  });
  const [editingItemIds, setEditingItemIds] = useState([]);

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

  useEffect(
    () => {
      setEditingItemIds([]);
    },
    [match.url],
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

  return (
    <>
      <h1 className="mb-4">{form.title}</h1>

      <Prompt
        when={editingItemIds.length > 0}
        message="You have form items open for editing. Are you sure you want to discard changes to them?"
      />

      <div className="row m-0">
        <div className="col-3 bg-light p-2">
          <ul className="nav nav-pills flex-column">
            {form.form_sections.map((formSection) => (
              <li key={formSection.id} className="nav-item">
                <NavLink
                  to={`/admin_forms/${match.params.id}/edit/section/${formSection.id}`}
                  className="nav-link"
                  replace
                >
                  {formSection.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="col p-2 border overflow-auto" style={{ height: '90vh' }}>
          {currentSection && (
            currentSection.form_items.map((formItem) => (
              editingItemIds.includes(formItem.id)
                ? (
                  <FormItemEditor
                    key={formItem.id}
                    convention={data.convention}
                    form={form}
                    formSectionId={currentSection.id}
                    initialFormItem={formItem}
                    initialRenderedFormItem={renderedFormItemsById.get(formItem.id)}
                    close={() => {
                      setEditingItemIds((prevValue) => prevValue
                        .filter((itemId) => itemId !== formItem.id));
                    }}
                  />
                )
                : (
                  <FormEditorItemPreview
                    key={formItem.id}
                    convention={data.convention}
                    form={form}
                    formItem={formItem}
                    renderedFormItem={renderedFormItemsById.get(formItem.id)}
                    startEditing={() => {
                      setEditingItemIds((prevValue) => [...prevValue, formItem.id]);
                    }}
                  />
                )
            ))
          )}
        </div>
      </div>
    </>
  );
}

FormEditor.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      sectionId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default FormEditor;

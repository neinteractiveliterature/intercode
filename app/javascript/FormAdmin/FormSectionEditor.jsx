import React, { useContext, useState, useEffect } from 'react';
import { Prompt, Redirect, useRouteMatch } from 'react-router-dom';

import { FormEditorContext, FormSectionEditorContext } from './FormEditorContexts';
import FormItemEditor from './FormItemEditor';
import FormEditorItemPreview from './FormEditorItemPreview';

function FormSectionEditor() {
  const match = useRouteMatch();
  const { convention, form, renderedFormItemsById } = useContext(FormEditorContext);
  const [editingItemIds, setEditingItemIds] = useState([]);

  useEffect(
    () => {
      setEditingItemIds([]);
    },
    [match.url],
  );

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

  if (!currentSection) {
    return null;
  }

  return (
    <FormSectionEditorContext.Provider value={{ currentSection }}>
      <Prompt
        when={editingItemIds.length > 0}
        message="You have form items open for editing. Are you sure you want to discard changes to them?"
      />
      {currentSection.form_items.map((formItem) => (
        editingItemIds.includes(formItem.id)
          ? (
            <FormItemEditor
              key={formItem.id}
              convention={convention}
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
              formItem={formItem}
              startEditing={() => {
                setEditingItemIds((prevValue) => [...prevValue, formItem.id]);
              }}
            />
          )
      ))}
    </FormSectionEditorContext.Provider>
  );
}

export default FormSectionEditor;

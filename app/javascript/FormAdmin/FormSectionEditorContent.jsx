import React, { useContext } from 'react';

import { FormEditorContext } from './FormEditorContexts';
import FormEditorItemPreview from './FormEditorItemPreview';

function FormSectionEditorContent() {
  const { currentSection } = useContext(FormEditorContext);

  if (!currentSection) {
    return null;
  }

  return (
    <>
      {currentSection.form_items.map((formItem, index) => (
        <FormEditorItemPreview
          key={formItem.id}
          formItem={formItem}
          index={index}
        />
      ))}
    </>
  );
}

export default FormSectionEditorContent;

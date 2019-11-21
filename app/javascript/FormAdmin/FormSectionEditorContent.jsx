import React, { useContext } from 'react';
import { useMutation } from 'react-apollo-hooks';

import { FormEditorContext } from './FormEditorContexts';
import FormEditorItemPreview from './FormEditorItemPreview';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { UpdateFormSection } from './mutations.gql';

function FormSectionEditorContent() {
  const { currentSection } = useContext(FormEditorContext);
  const [updateFormSection] = useMutation(UpdateFormSection);

  const updateSectionTitle = async (title) => {
    await updateFormSection({
      variables: { id: currentSection.id, formSection: { title } },
    });
  };

  if (!currentSection) {
    return null;
  }

  return (
    <>
      <div className="card-header px-2">
        <InPlaceEditor
          className="d-flex align-items-start w-100"
          value={currentSection.title}
          onChange={updateSectionTitle}
        >
          <h4 className="m-0">{currentSection.title}</h4>
        </InPlaceEditor>
      </div>

      <div className="p-2">
        {currentSection.form_items.map((formItem, index) => (
          <FormEditorItemPreview
            key={formItem.id}
            formItem={formItem}
            index={index}
          />
        ))}
      </div>
    </>
  );
}

export default FormSectionEditorContent;

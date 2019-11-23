import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import { CreateFormSection, MoveFormSection } from './mutations.gql';
import { FormEditorContext } from './FormEditorContexts';
import { FormEditorQuery } from './queries.gql';
import { useCreateMutation } from '../MutationUtils';
import { serializeParsedFormSection } from './FormItemUtils';
import FormSectionNavItem from './FormSectionNavItem';

function FormSectionNav() {
  const history = useHistory();
  const { form } = useContext(FormEditorContext);
  const [moveFormSection] = useMutation(MoveFormSection);
  const addFormSection = useCreateMutation(CreateFormSection, {
    query: FormEditorQuery,
    queryVariables: { id: form.id },
    arrayPath: ['form', 'form_sections'],
    newObjectPath: ['createFormSection', 'form_section'],
  });

  const moveSection = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedSection = form.form_sections[dragIndex];
      const optimisticSections = form.form_sections.map(serializeParsedFormSection);
      optimisticSections.splice(dragIndex, 1);
      optimisticSections.splice(hoverIndex, 0, serializeParsedFormSection(draggedSection));

      const optimisticResponse = {
        moveFormSection: {
          __typename: 'Mutation',
          form: {
            ...form,
            form_sections: optimisticSections.map((section, sectionIndex) => ({
              ...section,
              position: sectionIndex + 1,
            })),
          },
        },
      };

      moveFormSection({
        variables: {
          id: draggedSection.id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse,
      });
    },
    [form, moveFormSection],
  );

  const addSection = async () => {
    const { data: { createFormSection: { form_section: { id } } } } = await addFormSection({
      variables: { formId: form.id, formSection: { title: 'New section' } },
    });
    history.replace(`/admin_forms/${form.id}/edit/section/${id}`);
  };

  return (
    <nav>
      <ul className="nav nav-pills flex-column">
        {form.form_sections.map((formSection, index) => (
          <FormSectionNavItem
            key={formSection.id}
            formSection={formSection}
            index={index}
            moveSection={moveSection}
          />
        ))}
      </ul>

      <div className="mt-4">
        <button className="btn btn-outline-primary w-100" type="button" onClick={addSection}>
          Add section
        </button>
      </div>
    </nav>
  );
}

export default FormSectionNav;

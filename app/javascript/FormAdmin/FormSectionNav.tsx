import { useContext, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useUniqueId } from '@neinteractiveliterature/litform';

import { FormEditorContext } from './FormEditorContexts';
import { useCreateMutation } from '../MutationUtils';
import { serializeParsedFormSection } from './FormItemUtils';
import FormSectionNavItem from './FormSectionNavItem';
import { buildOptimisticArrayForMove } from '../useSortable';
import useCollapse from '../NavigationBar/useCollapse';
import {
  useMoveFormSectionMutation,
  CreateFormSectionDocument,
  CreateFormSectionMutationData,
  CreateFormSectionMutationVariables,
} from './mutations.generated';
import {
  FormEditorQueryDocument,
  FormEditorQueryData,
  FormEditorQueryVariables,
} from './queries.generated';

function FormSectionNav() {
  const collapseRef = useRef<HTMLElement>(null);
  const { collapsed, collapseProps, toggleCollapsed } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const history = useHistory();
  const { form } = useContext(FormEditorContext);
  const [moveFormSection] = useMoveFormSectionMutation();
  const addFormSection = useCreateMutation<
    FormEditorQueryData,
    FormEditorQueryVariables,
    CreateFormSectionMutationVariables,
    CreateFormSectionMutationData
  >(CreateFormSectionDocument, {
    query: FormEditorQueryDocument,
    queryVariables: { id: form.id },
    arrayPath: ['form', 'form_sections'],
    newObjectPath: ['createFormSection', 'form_section'],
  });
  const navId = useUniqueId('section-nav-');

  const moveSection = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const optimisticSections = buildOptimisticArrayForMove(
        form.form_sections,
        dragIndex,
        hoverIndex,
      ).map(serializeParsedFormSection);

      moveFormSection({
        variables: {
          id: form.form_sections[dragIndex].id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          moveFormSection: {
            __typename: 'MoveFormSectionPayload',
            form: {
              ...form,
              form_sections: optimisticSections,
            },
          },
        },
      });
    },
    [form, moveFormSection],
  );

  const addSection = async () => {
    const result = await addFormSection({
      variables: { formId: form.id, formSection: { title: 'New section' } },
    });
    const formSectionId = result.data!.createFormSection!.form_section.id;
    history.replace(`/admin_forms/${form.id}/edit/section/${formSectionId}`);
  };

  return (
    <>
      <button
        className="btn p-0 d-lg-none"
        type="button"
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls={navId}
      >
        <i className={`fa ${collapsed ? 'fa-caret-right' : 'fa-caret-down'}`} /> Sections
      </button>
      <nav
        id={navId}
        className={`d-lg-block ${collapseClassName}`}
        ref={collapseRef}
        {...otherCollapseProps}
      >
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
    </>
  );
}

export default FormSectionNav;

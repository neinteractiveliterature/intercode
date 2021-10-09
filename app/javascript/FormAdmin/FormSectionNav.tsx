import { useContext, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useUniqueId,
  buildOptimisticArrayForMove,
  useArrayBasicSortableHandlers,
  useCreateMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormEditorContext } from './FormEditorContexts';
import { serializeParsedFormSection } from './FormItemUtils';
import FormSectionNavItem from './FormSectionNavItem';
import useCollapse from '../NavigationBar/useCollapse';
import { useMoveFormSectionMutation, useCreateFormSectionMutation } from './mutations.generated';
import { FormEditorFormSectionFieldsFragmentDoc } from './queries.generated';
import { useSortableDndSensors } from '../SortableUtils';
import FormSectionNavItemDragOverlay from './FormSectionNavItemDragOverlay';

function FormSectionNav(): JSX.Element {
  const collapseRef = useRef<HTMLElement>(null);
  const { collapsed, collapseProps, toggleCollapsed } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const history = useHistory();
  const { form, convention } = useContext(FormEditorContext);
  const [moveFormSection] = useMoveFormSectionMutation();
  const [addFormSection] = useCreateMutationWithReferenceArrayUpdater(
    useCreateFormSectionMutation,
    convention.form,
    'form_sections',
    (data) => data.createFormSection.form_section,
    FormEditorFormSectionFieldsFragmentDoc,
    'FormEditorFormSectionFields',
  );
  const navId = useUniqueId('section-nav-');
  const sensors = useSortableDndSensors();

  const moveSection = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const optimisticSections = buildOptimisticArrayForMove(form.form_sections, dragIndex, hoverIndex).map(
        serializeParsedFormSection,
      );

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

  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(form.form_sections, moveSection, 'id');

  const addSection = async () => {
    const result = await addFormSection({
      variables: { formId: form.id, formSection: { title: 'New section' } },
    });
    const formSectionId = result.data?.createFormSection.form_section.id;
    if (formSectionId) {
      history.replace(`/admin_forms/${form.id}/edit/section/${formSectionId}`);
    }
  };

  return (
    <DndContext sensors={sensors} {...sortableHandlers}>
      <button
        className="btn p-0 d-lg-none"
        type="button"
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls={navId}
      >
        <i className={collapsed ? 'bi-caret-right' : 'bi-caret-down'} /> Sections
      </button>
      <nav id={navId} className={`d-lg-block ${collapseClassName}`} ref={collapseRef} {...otherCollapseProps}>
        <ul className="nav nav-pills flex-column">
          <SortableContext
            items={form.form_sections.map((formSection) => formSection.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {form.form_sections.map((formSection) => (
              <FormSectionNavItem key={formSection.id} formSection={formSection} />
            ))}
          </SortableContext>
        </ul>

        <div className="mt-4">
          <button className="btn btn-outline-primary w-100" type="button" onClick={addSection}>
            Add section
          </button>
        </div>
      </nav>

      <DragOverlay>{draggingItem && <FormSectionNavItemDragOverlay formSection={draggingItem} />}</DragOverlay>
    </DndContext>
  );
}

export default FormSectionNav;

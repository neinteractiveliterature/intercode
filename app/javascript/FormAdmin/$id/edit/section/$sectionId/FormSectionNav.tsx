import { useContext, useCallback, useRef, useId } from 'react';
import { useFetcher } from 'react-router-dom';
import { useArrayBasicSortableHandlers } from '@neinteractiveliterature/litform';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import useCollapse from 'NavigationBar/useCollapse';
import { FormEditorContext } from 'FormAdmin/FormEditorContexts';
import { useSortableDndSensors } from 'SortableUtils';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import FormSectionNavItemDragOverlay from './FormSectionNavItemDragOverlay';
import FormSectionNavItem from './FormSectionNavItem';

function FormSectionNav(): JSX.Element {
  const collapseRef = useRef<HTMLElement>(null);
  const { collapsed, collapseProps, toggleCollapsed } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const { form } = useContext(FormEditorContext);
  const moveFetcher = useFetcher();
  const createFetcher = useFetcher();
  const navId = useId();
  const sensors = useSortableDndSensors();

  const moveSection = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const sectionId = form.form_sections[dragIndex].id;
      moveFetcher.submit(
        { destination_index: hoverIndex },
        { action: `/admin_forms/${form.id}/edit/section/${sectionId}/move`, method: 'PATCH' },
      );
    },
    [form, moveFetcher],
  );

  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(form.form_sections, moveSection, 'id');

  const addSection = async () => {
    createFetcher.submit({ title: 'New section' }, { action: `/admin_forms/${form.id}/edit/section`, method: 'POST' });
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

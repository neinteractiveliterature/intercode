import { useCallback, useContext } from 'react';
import { useArrayBasicSortableHandlers, useMatchWidthStyle } from '@neinteractiveliterature/litform';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { useFetcher } from 'react-router';
import { FormEditorContext } from 'FormAdmin/FormEditorContexts';
import { useSortableDndSensors } from 'SortableUtils';
import InPlaceEditor from 'BuiltInFormControls/InPlaceEditor';
import FormEditorItemPreview from './FormEditorItemPreview';
import FormEditorItemPreviewDragOverlay from './FormEditorItemPreviewDragOverlay';

function FormSectionEditorContent(): JSX.Element {
  const { currentSection } = useContext(FormEditorContext);
  const moveFetcher = useFetcher();
  const updateFetcher = useFetcher();

  const sensors = useSortableDndSensors();

  const updateSectionTitle = async (title: string | null) => {
    if (currentSection) {
      updateFetcher.submit({ title }, { action: '.', method: 'PATCH' });
    }
  };

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!currentSection) {
        return;
      }

      const itemId = currentSection.form_items[dragIndex].id;
      moveFetcher.submit(
        { destination_index: hoverIndex, destination_section_id: currentSection.id },
        { action: `item/${itemId}/move`, method: 'PATCH' },
      );
    },
    [currentSection, moveFetcher],
  );

  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLDivElement>();
  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(
    currentSection?.form_items ?? [],
    moveItem,
    'id',
  );

  if (!currentSection) {
    return <></>;
  }

  return (
    <DndContext sensors={sensors} {...sortableHandlers} collisionDetection={closestCorners}>
      <div className="container">
        <div className="card my-2">
          <div className="card-header">
            <InPlaceEditor
              className="d-flex align-items-start w-100"
              value={currentSection.title}
              onChange={updateSectionTitle}
            >
              <h4 className="m-0">{currentSection.title}</h4>
            </InPlaceEditor>
          </div>

          <div className="card-body" ref={matchWidthRef}>
            <SortableContext
              items={currentSection.form_items.map((formItem) => formItem.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              {currentSection.form_items.map((formItem) => (
                <FormEditorItemPreview key={formItem.id} formSection={currentSection} formItem={formItem} />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggingItem && (
          <div style={matchWidthStyle}>
            <FormEditorItemPreviewDragOverlay formItem={draggingItem} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default FormSectionEditorContent;

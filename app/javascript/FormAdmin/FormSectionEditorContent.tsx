import { useCallback, useContext } from 'react';
import {
  buildOptimisticArrayForMove,
  useArrayBasicSortableHandlers,
  useMatchWidthStyle,
} from '@neinteractiveliterature/litform';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { FormEditorContext } from './FormEditorContexts';
import FormEditorItemPreview from './FormEditorItemPreview';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { useMoveFormItemMutation, useUpdateFormSectionMutation } from './mutations.generated';
import { useSortableDndSensors } from '../SortableUtils';
import FormEditorItemPreviewDragOverlay from './FormEditorItemPreviewDragOverlay';
import { serializeParsedFormItem } from './serializeParsedFormItem';

function FormSectionEditorContent(): JSX.Element {
  const { currentSection } = useContext(FormEditorContext);
  const [updateFormSection] = useUpdateFormSectionMutation();
  const [moveFormItem] = useMoveFormItemMutation();

  const sensors = useSortableDndSensors();

  const updateSectionTitle = async (title: string | null | undefined) => {
    if (currentSection) {
      await updateFormSection({
        variables: { id: currentSection.id, formSection: { title } },
      });
    }
  };

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!currentSection) {
        return;
      }

      const optimisticItems = buildOptimisticArrayForMove(
        currentSection.form_items.map(serializeParsedFormItem),
        dragIndex,
        hoverIndex,
      );

      moveFormItem({
        variables: {
          id: currentSection.form_items[dragIndex].id,
          formSectionId: currentSection.id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          moveFormItem: {
            __typename: 'MoveFormItemPayload',
            form_section: {
              ...currentSection,
              form_items: optimisticItems,
            },
          },
        },
      });
    },
    [currentSection, moveFormItem],
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

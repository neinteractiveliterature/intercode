import {
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS, Transform } from '@dnd-kit/utilities';
import { useCallback, useState } from 'react';

export function useSortableDndSensors() {
  return useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
}

export function getSortableStyle(
  transform: Transform | null,
  transition: string | null,
  isDragging: boolean,
) {
  return {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isDragging ? 0.5 : undefined,
  };
}

export function useBasicSortableHandlers<T>(
  getItem: (id: string) => T,
  getItemIndex: (id: string) => number,
  moveItem: (activeIndex: number, overIndex: number) => unknown,
) {
  const [draggingItem, setDraggingItem] = useState<T>();

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const activeItem = getItem(active.id);
      setDraggingItem(activeItem);
    },
    [getItem],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      const activeIndex = getItemIndex(active.id);
      const overIndex = over ? getItemIndex(over.id) : undefined;

      if (activeIndex != null && overIndex != null && activeIndex !== overIndex) {
        moveItem(activeIndex, overIndex);
      }
    },
    [getItemIndex, moveItem],
  );

  const handleDragEnd = useCallback(() => {
    setDraggingItem(undefined);
  }, []);

  return {
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDragCancel: handleDragEnd,
    draggingItem,
  };
}

export function useArrayBasicSortableHandlers<
  IdType extends { toString(): string },
  T extends { id: IdType },
>(array: T[], moveItem: (activeIndex: number, overIndex: number) => unknown) {
  const getItem = useCallback(
    (id: string) => array.find((item) => item.id.toString() === id),
    [array],
  );

  const getItemIndex = useCallback(
    (id: string) => array.findIndex((item) => item.id.toString() === id),
    [array],
  );

  return useBasicSortableHandlers(getItem, getItemIndex, moveItem);
}

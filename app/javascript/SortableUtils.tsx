import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS, Transform } from '@dnd-kit/utilities';
import { CSSProperties } from 'react';

export function useSortableDndSensors(): ReturnType<typeof useSensors> {
  return useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
}

export function getSortableStyle(
  transform: Transform | null,
  transition: string | undefined,
  isDragging: boolean,
): CSSProperties {
  return {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isDragging ? 0.5 : undefined,
  };
}

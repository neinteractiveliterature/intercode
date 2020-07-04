import {
  useCallback, useRef, RefObject, MutableRefObject,
} from 'react';
import {
  useDrag, useDrop, DragSourceOptions, DragElementWrapper,
} from 'react-dnd';

export type MoveItemFunction = (dragIndex: number, hoverIndex: number) => void;

export function useSortHover<T extends HTMLElement>(
  ref: RefObject<T | undefined>,
  index: number,
  moveItem: MoveItemFunction,
) {
  return useCallback(
    (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex; // eslint-disable-line no-param-reassign
    },
    [index, moveItem, ref],
  );
}

export default function useSortable<T extends HTMLElement>(
  index: number,
  moveItem: MoveItemFunction,
  itemType: string,
): [
    MutableRefObject<T | null>,
    DragElementWrapper<DragSourceOptions>,
    { isDragging: boolean }
  ] {
  const ref = useRef<T>(null);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { index, type: itemType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const hover = useSortHover(ref, index, moveItem);
  const [, drop] = useDrop({ accept: itemType, hover });
  preview(drop(ref));

  return [ref, drag, { isDragging }];
}

export function buildOptimisticArrayForMove<T>(items: T[], dragIndex: number, hoverIndex: number) {
  const draggedItem = items[dragIndex];
  const optimisticItems = [...items];
  optimisticItems.splice(dragIndex, 1);
  optimisticItems.splice(hoverIndex, 0, draggedItem);

  return optimisticItems.map((item, itemIndex) => ({
    ...item,
    position: itemIndex + 1,
  }));
}

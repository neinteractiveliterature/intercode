import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { KeysOfType, useArrayBasicSortableHandlers } from '@neinteractiveliterature/litform';

import usePropertyUpdater from './usePropertyUpdater';
import { TypedFormItem } from '../FormItemUtils';
import { GeneratedIdObject, WithoutGeneratedId } from '../../GeneratedIdUtils';

export type UseArrayPropertyResult<ElementType extends { generatedId: string }> = [
  addItem: () => void,
  itemChanged: (generatedId: string, updater: (item: ElementType) => ElementType) => void,
  deleteItem: (generatedId: string) => void,
  draggingItem: ElementType | undefined,
  sortableHandlers: Omit<ReturnType<typeof useArrayBasicSortableHandlers>, 'draggingItem'>,
];

export default function useArrayProperty<
  ElementType extends GeneratedIdObject<string>,
  FormItemType extends TypedFormItem,
  PropertyName extends KeysOfType<NonNullable<FormItemType['properties']>, ElementType[]>,
>(
  array: ElementType[],
  property: PropertyName,
  onChange: React.Dispatch<React.SetStateAction<FormItemType>>,
  generateNewItem: () => WithoutGeneratedId<ElementType>,
): UseArrayPropertyResult<ElementType> {
  const updateItems = usePropertyUpdater<FormItemType, PropertyName>(onChange, property) as unknown as React.Dispatch<
    React.SetStateAction<ElementType[]>
  >;

  const itemChanged = useCallback(
    (generatedId: string, updater: (item: ElementType) => ElementType) => {
      updateItems((prevItems: ElementType[]) =>
        prevItems.map((item) => {
          if (item.generatedId !== generatedId) {
            return item;
          }

          return updater(item);
        }),
      );
    },
    [updateItems],
  );

  const addItem = useCallback(
    () =>
      updateItems((prevItems: ElementType[]) => [
        ...prevItems,
        { ...generateNewItem(), generatedId: uuidv4() } as ElementType,
      ]),
    [generateNewItem, updateItems],
  );

  const deleteItem = useCallback(
    (generatedId: string) => {
      updateItems((prevItems) => prevItems.filter((item: ElementType) => item.generatedId !== generatedId));
    },
    [updateItems],
  );

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      updateItems((prevItems: ElementType[]) => {
        const newItems = [...prevItems];
        const draggedItem = newItems[dragIndex];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);
        return newItems;
      });
    },
    [updateItems],
  );

  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(array, moveItem, 'generatedId');

  return [addItem, itemChanged, deleteItem, draggingItem, sortableHandlers];
}

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import usePropertyUpdater from './usePropertyUpdater';
import { ParsedFormItem } from '../FormItemUtils';
import { WithoutGeneratedId } from '../../GeneratedIdUtils';
import { useBasicSortableHandlers } from '../../SortableUtils';

// https://stackoverflow.com/questions/46583883/typescript-pick-properties-with-a-defined-type
type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

export default function useArrayProperty<
  ElementType extends { generatedId: string },
  FormItemType extends ParsedFormItem<any, any>,
  PropertyName extends KeysOfType<FormItemType['properties'], Array<ElementType>>,
>(
  array: ElementType[],
  property: PropertyName,
  onChange: React.Dispatch<React.SetStateAction<FormItemType>>,
  generateNewItem: () => WithoutGeneratedId<FormItemType['properties'][PropertyName][0]>,
) {
  const updateItems = usePropertyUpdater<FormItemType, PropertyName>(onChange, property);

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
        { ...generateNewItem(), generatedId: uuidv4() },
      ]),
    [generateNewItem, updateItems],
  );

  const deleteItem = useCallback(
    (generatedId: string) => {
      onChange((prevFormItem) => ({
        ...prevFormItem,
        properties: {
          ...prevFormItem.properties,
          [property]: prevFormItem.properties[property].filter(
            (item: ElementType) => item.generatedId !== generatedId,
          ),
        },
      }));
    },
    [onChange, property],
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

  const { draggingItem, ...sortableHandlers } = useBasicSortableHandlers(
    useCallback((id) => array.find((element) => element.generatedId === id), [array]),
    useCallback((id) => array.findIndex((element) => element.generatedId === id), [array]),
    moveItem,
  );

  return [addItem, itemChanged, deleteItem, draggingItem, sortableHandlers] as const;
}

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import usePropertyUpdater from './usePropertyUpdater';
import { ParsedFormItem } from '../FormItemUtils';

export default function useArrayProperty<ElementType extends { generatedId: string }>(
  property: string,
  onChange: React.Dispatch<React.SetStateAction<ParsedFormItem<any, any>>>,
  generateNewItem: () => Omit<ElementType, 'generatedId'>,
) {
  const updateItems: React.Dispatch<React.SetStateAction<ElementType[]>> = usePropertyUpdater(
    onChange, property,
  );

  const itemChanged = useCallback(
    (generatedId: string, updater: (prevItem: ElementType) => ElementType) => {
      updateItems((prevItems: ElementType[]) => prevItems.map((item: ElementType) => {
        if (item.generatedId !== generatedId) {
          return item;
        }

        return updater(item);
      }));
    },
    [updateItems],
  );

  const addItem = useCallback(
    () => updateItems((prevItems: ElementType[]) => {
      const newItem = generateNewItem();
      return [...prevItems, { ...newItem, generatedId: uuidv4() } as ElementType];
    }),
    [generateNewItem, updateItems],
  );

  const deleteItem = useCallback(
    (generatedId: string) => {
      onChange((prevFormItem) => ({
        ...prevFormItem,
        properties: {
          ...prevFormItem.properties,
          [property]: (prevFormItem.properties[property] as ElementType[])
            .filter((item: ElementType) => (
              item.generatedId !== generatedId
            )),
        },
      }));
    },
    [onChange, property],
  );

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
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

  return [addItem, itemChanged, deleteItem, moveItem] as const;
}

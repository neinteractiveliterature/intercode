import { useCallback } from 'react';

import generateChoiceId from '../generateChoiceId';
import usePropertyUpdater from './usePropertyUpdater';

export default function useArrayProperty(property, onChange, generateNewItem) {
  const updateItems = usePropertyUpdater(onChange, property);

  const itemChanged = useCallback(
    (generatedId, updater) => {
      updateItems((prevItems) => prevItems.map((item) => {
        if (item.generatedId !== generatedId) {
          return item;
        }

        return updater(item);
      }));
    },
    [updateItems],
  );

  const addItem = useCallback(
    () => updateItems((prevItems) => [
      ...prevItems,
      { ...generateNewItem(), generatedId: generateChoiceId() },
    ]),
    [generateNewItem, updateItems],
  );

  const deleteItem = useCallback(
    (generatedId) => {
      onChange((prevFormItem) => ({
        ...prevFormItem,
        properties: {
          ...prevFormItem.properties,
          [property]: prevFormItem.properties[property].filter((item) => (
            item.generatedId !== generatedId
          )),
        },
      }));
    },
    [onChange, property],
  );

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      updateItems((prevItems) => {
        const newItems = [...prevItems];
        const draggedItem = newItems[dragIndex];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);
        return newItems;
      });
    },
    [updateItems],
  );

  return [addItem, itemChanged, deleteItem, moveItem];
}

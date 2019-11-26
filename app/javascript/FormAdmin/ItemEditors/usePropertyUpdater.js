import { useCallback } from 'react';

export default function usePropertyUpdater(onChange, property) {
  return useCallback(
    (newValueOrUpdater) => onChange((prevFormItem) => {
      const newValue = (
        typeof newValueOrUpdater === 'function'
          ? newValueOrUpdater(prevFormItem.properties[property])
          : newValueOrUpdater
      );

      return ({
        ...prevFormItem,
        properties: {
          ...prevFormItem.properties,
          [property]: newValue,
        },
      });
    }),
    [onChange, property],
  );
}

import { useCallback, SetStateAction } from 'react';
import { ParsedFormItem } from '../FormItemUtils';

function isSetStateFunction<S>(
  newValueOrUpdater: SetStateAction<S>,
): newValueOrUpdater is ((prevState: S) => S) {
  return typeof newValueOrUpdater === 'function';
}

export default function usePropertyUpdater<
T extends ParsedFormItem<any, any>,
P extends keyof T['properties']
>(
  onChange: React.Dispatch<(prevFormItem: T) => T>,
  property: P,
) {
  return useCallback(
    (newValueOrUpdater: SetStateAction<T['properties'][P]>) => onChange((prevFormItem: T) => {
      const newValue = (
        isSetStateFunction(newValueOrUpdater)
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

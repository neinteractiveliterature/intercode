import { useCallback } from 'react';
import { ParsedFormItem } from '../FormItemUtils';

function isUpdaterFunction<T>(
  valueOrUpdater: React.SetStateAction<T>,
): valueOrUpdater is (prevState: T) => T {
  return typeof valueOrUpdater === 'function';
}

export default function usePropertyUpdater<
  FormItemType extends ParsedFormItem<any, any>,
  PropertyName extends keyof FormItemType['properties']
>(onChange: React.Dispatch<React.SetStateAction<FormItemType>>, property: PropertyName) {
  return useCallback(
    (newValueOrUpdater: React.SetStateAction<FormItemType['properties'][PropertyName]>) =>
      onChange((prevFormItem: FormItemType) => {
        const newValue = isUpdaterFunction(newValueOrUpdater)
          ? newValueOrUpdater(prevFormItem.properties[property])
          : newValueOrUpdater;

        return {
          ...prevFormItem,
          properties: {
            ...prevFormItem.properties,
            [property]: newValue,
          },
        };
      }),
    [onChange, property],
  );
}

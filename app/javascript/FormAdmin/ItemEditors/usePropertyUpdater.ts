import { useCallback } from 'react';
import { ParsedFormItem } from '../FormItemUtils';

function isUpdaterFunction<T>(valueOrUpdater: React.SetStateAction<T>): valueOrUpdater is (prevState: T) => T {
  return typeof valueOrUpdater === 'function';
}

export default function usePropertyUpdater<
  FormItemType extends ParsedFormItem<Record<string, unknown>, unknown>,
  PropertyName extends keyof PropertiesType,
  PropertiesType = NonNullable<FormItemType['properties']>,
>(
  onChange: React.Dispatch<React.SetStateAction<FormItemType>>,
  property: PropertyName,
): React.Dispatch<React.SetStateAction<PropertiesType[PropertyName]>> {
  return useCallback(
    (newValueOrUpdater: React.SetStateAction<PropertiesType[PropertyName]>) =>
      onChange((prevFormItem: FormItemType) => {
        const prevProperties = prevFormItem.properties as PropertiesType;
        const newValue = isUpdaterFunction(newValueOrUpdater)
          ? newValueOrUpdater(prevProperties[property])
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

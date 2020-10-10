import { OptionsType, ValueType } from 'react-select';

export function isMultiValue<OptionType>(
  value: ValueType<OptionType>,
): value is OptionsType<OptionType> {
  return Array.isArray(value);
}

export function onChangeSingleValue<OptionType>(
  setter: React.Dispatch<OptionType | null | undefined>,
) {
  return (value: ValueType<OptionType>) => {
    if (isMultiValue(value)) {
      return;
    }

    setter(value);
  };
}

export function onChangeMultiValue<OptionType>(setter: React.Dispatch<OptionsType<OptionType>>) {
  return (value: ValueType<OptionType>) => {
    if (isMultiValue(value)) {
      setter(value);
    }
  };
}

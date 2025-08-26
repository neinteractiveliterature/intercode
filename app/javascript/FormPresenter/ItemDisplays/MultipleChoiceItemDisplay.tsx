import { FormItemValueType, MultipleChoiceFormItem } from '../../FormAdmin/FormItemUtils';

type SingleCastedValue = string | null;
type CastedValue = SingleCastedValue | CastedValue[];

function castValue(value: FormItemValueType<MultipleChoiceFormItem> | null | undefined): CastedValue {
  if (value == null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => castValue(item));
  }

  return value.toString();
}

export type MultipleChoiceItemDisplayProps = {
  formItem: MultipleChoiceFormItem;
  value: FormItemValueType<MultipleChoiceFormItem>;
};

function MultipleChoiceItemDisplay({
  formItem,
  value: uncastValue,
}: MultipleChoiceItemDisplayProps): React.JSX.Element {
  const value = castValue(uncastValue);
  const isValueOther = (v: string) => !formItem.rendered_properties.choices.some((choice) => choice.value === v);

  if (Array.isArray(value)) {
    const selectedChoiceLabels = formItem.rendered_properties.choices
      .map((choice) => {
        if (value.includes(choice.value)) {
          return choice.caption;
        }

        return null;
      })
      .filter((selectedChoiceLabel) => selectedChoiceLabel != null);

    const otherChoiceLabels = value.filter(isValueOther).map((choice) => `Other: ${choice}`);

    return <>{[...selectedChoiceLabels, ...otherChoiceLabels].join(', ')}</>;
  }

  const selectedChoice = formItem.rendered_properties.choices.find((choice) => value === choice.value);

  if (selectedChoice) {
    return <>{selectedChoice.caption}</>;
  }

  return <>{value}</>;
}

export default MultipleChoiceItemDisplay;

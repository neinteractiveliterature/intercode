import { ChoiceSet } from '@neinteractiveliterature/litform';
import { useMemo } from 'react';
import { MultipleChoiceFormItem } from '../../FormAdmin/FormItemUtils';
import { CommonFormItemFilterProps } from './CommonFormItemFilterProps';

export type MultipleChoiceItemFilterProps = CommonFormItemFilterProps<MultipleChoiceFormItem>;

function MultipleChoiceItemFilter({ formItem, onChange, value }: MultipleChoiceItemFilterProps): React.JSX.Element {
  const choicesForChoiceSet = useMemo(() => {
    const providedChoices = formItem.rendered_properties.choices.map((choice) => ({
      label: choice.caption,
      value: choice.value,
    }));

    return providedChoices;
  }, [formItem.rendered_properties.choices]);

  return (
    <ChoiceSet name={formItem.identifier} choices={choicesForChoiceSet} value={value} onChange={onChange} multiple />
  );
}

export default MultipleChoiceItemFilter;

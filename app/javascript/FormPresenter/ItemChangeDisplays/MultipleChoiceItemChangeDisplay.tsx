import TextDiffDisplay from './TextDiffDisplay';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { MultipleChoiceFormItem } from '../../FormAdmin/FormItemUtils';

export type MultipleChoiceItemChangeDisplayProps = {
  change: ParsedFormResponseChange<MultipleChoiceFormItem>;
};

function MultipleChoiceItemChangeDisplay({ change }: MultipleChoiceItemChangeDisplayProps): React.JSX.Element {
  const { previous_value: before, new_value: after } = change;

  if (Array.isArray(before) || Array.isArray(after)) {
    const beforeArray = Array.isArray(before) ? before : [before];
    const afterArray = Array.isArray(after) ? after : [after];

    return <TextDiffDisplay before={beforeArray.join(', ')} after={afterArray.join(', ')} />;
  }

  return <TextDiffDisplay before={(before || '').toString()} after={(after || '').toString()} />;
}

export default MultipleChoiceItemChangeDisplay;

import TextDiffDisplay from './TextDiffDisplay';
import { FreeTextFormItem } from '../../FormAdmin/FormItemUtils';
import { ParsedFormResponseChange } from './FormItemChangeUtils';

export type FreeTextItemChangeDisplayProps = {
  formItem: FreeTextFormItem;
  change: ParsedFormResponseChange<FreeTextFormItem>;
};

function FreeTextItemChangeDisplay({ formItem, change }: FreeTextItemChangeDisplayProps): React.JSX.Element {
  const { previous_value: before, new_value: after } = change;

  if (formItem.rendered_properties.format === 'markdown') {
    return (
      <div className="font-monospace small border rounded p-1">
        <TextDiffDisplay before={before} after={after} />
      </div>
    );
  }

  return <TextDiffDisplay before={before} after={after} />;
}

export default FreeTextItemChangeDisplay;

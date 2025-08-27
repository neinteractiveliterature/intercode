import ObjectDiffDisplay from './ObjectDiffDisplay';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { AgeRestrictionsFormItem } from '../../FormAdmin/FormItemUtils';
import humanize from '../../humanize';

export type AgeRestrictionsItemChangeDisplayProps = {
  change: ParsedFormResponseChange<AgeRestrictionsFormItem>;
};

function AgeRestrictionsItemChangeDisplay({ change }: AgeRestrictionsItemChangeDisplayProps): React.JSX.Element {
  const { previous_value: before, new_value: after } = change;

  return (
    <div className="border p-1 rounded">
      <ObjectDiffDisplay before={before} after={after} renderKey={(key) => humanize(key)} />
    </div>
  );
}

export default AgeRestrictionsItemChangeDisplay;

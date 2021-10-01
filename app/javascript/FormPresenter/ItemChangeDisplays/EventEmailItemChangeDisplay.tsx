import { humanize } from 'inflected';

import ObjectDiffDisplay from './ObjectDiffDisplay';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { EventEmailFormItem } from '../../FormAdmin/FormItemUtils';

export type EventEmailItemChangeDisplayProps = {
  change: ParsedFormResponseChange<EventEmailFormItem>;
};

function EventEmailItemChangeDisplay({ change }: EventEmailItemChangeDisplayProps): JSX.Element {
  const { previous_value: before, new_value: after } = change;

  return (
    <div className="border p-1 rounded">
      <ObjectDiffDisplay before={before} after={after} renderKey={(key) => humanize(key)} />
    </div>
  );
}

export default EventEmailItemChangeDisplay;

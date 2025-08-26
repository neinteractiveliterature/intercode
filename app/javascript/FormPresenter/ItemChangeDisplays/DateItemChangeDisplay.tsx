import { useMemo, useContext } from 'react';
import TextDiffDisplay from './TextDiffDisplay';

import { describeDate } from '../ItemDisplays/DateItemDisplay';
import AppRootContext from '../../AppRootContext';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { DateFormItem } from '../../FormAdmin/FormItemUtils';
import { useAppDateTimeFormat } from '../../TimeUtils';

export type DateItemChangeDisplayProps = {
  change: ParsedFormResponseChange<DateFormItem>;
};

function DateItemChangeDisplay({ change }: DateItemChangeDisplayProps): React.JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const before = useMemo(
    () => describeDate(change.previous_value || '', timezoneName, format),
    [change.previous_value, timezoneName, format],
  );
  const after = useMemo(
    () => describeDate(change.new_value || '', timezoneName, format),
    [change.new_value, timezoneName, format],
  );

  return <TextDiffDisplay before={before} after={after} />;
}

export default DateItemChangeDisplay;

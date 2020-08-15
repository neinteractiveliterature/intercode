import React, { useMemo, useContext } from 'react';
import TextDiffDisplay from './TextDiffDisplay';

import { describeDate } from '../ItemDisplays/DateItemDisplay';
import AppRootContext from '../../AppRootContext';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { DateFormItem } from '../../FormAdmin/FormItemUtils';

export type DateItemChangeDisplayProps = {
  change: ParsedFormResponseChange<DateFormItem>;
};

function DateItemChangeDisplay({ change }: DateItemChangeDisplayProps) {
  const { timezoneName } = useContext(AppRootContext);
  const before = useMemo(() => describeDate(change.previous_value || '', timezoneName), [
    change.previous_value,
    timezoneName,
  ]);
  const after = useMemo(() => describeDate(change.new_value || '', timezoneName), [
    change.new_value,
    timezoneName,
  ]);

  return <TextDiffDisplay before={before} after={after} />;
}

export default DateItemChangeDisplay;

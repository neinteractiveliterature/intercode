import React, { useCallback, useMemo } from 'react';

import DateTimeInput from './DateTimeInput';
import { convertDatetimeValue } from '../ComposableFormUtils';
import { TimespanWithValueGeneric } from '../ScheduledValueUtils';

export type ScheduledValueTimespanRowDatepickerProps = {
  fieldName: 'start' | 'finish',
  timespan: TimespanWithValueGeneric<any>,
  rowAttributeDidChange: (field: 'start' | 'finish', newValue?: string | null) => void,
  timezoneName: string,
};

function ScheduledValueTimespanRowDatepicker({
  fieldName, timespan, rowAttributeDidChange, timezoneName,
}: ScheduledValueTimespanRowDatepickerProps) {
  const stringValue = useMemo(
    () => convertDatetimeValue(timespan[fieldName], timezoneName),
    [fieldName, timespan, timezoneName],
  );

  const datetimeValueChanged = useCallback(
    (newValue?: string | null) => rowAttributeDidChange(fieldName, newValue),
    [fieldName, rowAttributeDidChange],
  );

  return (
    <div className="d-flex">
      <DateTimeInput
        value={stringValue}
        timezoneName={timezoneName}
        onChange={datetimeValueChanged}
      />
    </div>
  );
}

export default React.memo(ScheduledValueTimespanRowDatepicker);

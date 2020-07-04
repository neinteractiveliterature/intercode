import React, { useCallback, ReactNode } from 'react';

import { TimespanWithValueGeneric } from '../ScheduledValueUtils';
import ScheduledValueTimespanRowDatepicker from './ScheduledValueTimespanRowDatepicker';

export function scheduledValueTimespanIsValid<ValueType>(
  timespan: TimespanWithValueGeneric<ValueType>,
) {
  if (!timespan.value) {
    return false;
  }

  return true;
}

export type ScheduledValueTimespanRowProps<ValueType> = {
  buildInput: (value: ValueType, valueChanged: (newValue: ValueType) => void) => ReactNode,
  rowIdentifier: number,
  timespan: TimespanWithValueGeneric<ValueType>,
  timezone: string,
  attributeDidChange: (rowIdentifier: number, field: string, value: ValueType) => void,
  deleteClicked: (rowIdentifier: number) => void,
};

function ScheduledValueTimespanRow<ValueType>({
  buildInput, rowIdentifier, timespan, timezone, attributeDidChange, deleteClicked,
}: ScheduledValueTimespanRowProps<ValueType>) {
  const rowAttributeDidChange = useCallback(
    (field, value) => attributeDidChange(rowIdentifier, field, value),
    [attributeDidChange, rowIdentifier],
  );

  const valueChanged = useCallback(
    (value) => rowAttributeDidChange('value', value),
    [rowAttributeDidChange],
  );

  const onDeleteClicked = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteClicked(rowIdentifier);
  };

  return (
    <tr>
      <td className="w-25">
        {buildInput(timespan.value, valueChanged)}
      </td>

      <td className="w-75">
        <div className="d-flex flex-row align-items-center justify-content-stretch">
          <div>from&nbsp;</div>
          <ScheduledValueTimespanRowDatepicker
            fieldName="start"
            timespan={timespan}
            rowAttributeDidChange={rowAttributeDidChange}
            timezoneName={timezone}
          />
          <div className="ml-4">to&nbsp;</div>
          <ScheduledValueTimespanRowDatepicker
            fieldName="finish"
            timespan={timespan}
            rowAttributeDidChange={rowAttributeDidChange}
            timezoneName={timezone}
          />
        </div>
      </td>

      <td className="w-25 text-right" style={{ verticalAlign: 'middle' }}>
        <button className="btn btn-danger btn-sm" onClick={onDeleteClicked} type="button">
          <i className="fa fa-trash-o" />
          <span className="sr-only">Delete timespan</span>
        </button>
      </td>
    </tr>
  );
}

export default ScheduledValueTimespanRow;

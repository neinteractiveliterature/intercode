import { useCallback } from 'react';
import * as React from 'react';
import { DateTime } from 'luxon';

import type { EditingTimespan } from './ScheduledValueEditor';

import DateTimeInput from './DateTimeInput';

export function scheduledValueTimespanIsValid(timespan: EditingTimespan<unknown>): boolean {
  if (!timespan.value) {
    return false;
  }

  return true;
}

export type ScheduledValueTimespanRowProps<ValueType> = {
  buildInput: (value: ValueType | undefined, onChange: React.Dispatch<ValueType | undefined>) => React.JSX.Element;
  rowIdentifier: number;
  timespan: EditingTimespan<ValueType>;
  timezone: string;
  finishDidChange: (rowIdentifier: number, finish: string | undefined) => void;
  valueDidChange: (rowIdentifier: number, value: ValueType | undefined) => void;
  deleteClicked: (rowIdentifier: number) => void;
  isLastTimespan: boolean;
};

function ScheduledValueTimespanRow<ValueType>({
  buildInput,
  rowIdentifier,
  timespan,
  timezone,
  finishDidChange,
  valueDidChange,
  deleteClicked,
  isLastTimespan,
}: ScheduledValueTimespanRowProps<ValueType>): React.JSX.Element {
  const rowFinishDidChange = useCallback(
    (finish: string | undefined) => finishDidChange(rowIdentifier, finish),
    [finishDidChange, rowIdentifier],
  );

  const valueChanged = useCallback(
    (value: ValueType) => valueDidChange(rowIdentifier, value),
    [valueDidChange, rowIdentifier],
  );

  const onDeleteClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteClicked(rowIdentifier);
  };

  return (
    <tr>
      <td className="w-25">{buildInput(timespan.value, valueChanged)}</td>

      <td className="w-75">
        <div className="d-flex flex-row align-items-center justify-content-stretch">
          {timespan.start
            ? `from ${DateTime.fromISO(timespan.start, { zone: timezone }).toLocaleString(DateTime.DATETIME_FULL)}`
            : 'anytime'}
          &nbsp;
          {isLastTimespan ? (
            'onwards'
          ) : (
            <>
              up to&nbsp;
              <div className="d-flex">
                <DateTimeInput value={timespan.finish} timezoneName={timezone} onChange={rowFinishDidChange} />
              </div>
            </>
          )}
        </div>
      </td>

      <td className="w-25 text-end" style={{ verticalAlign: 'middle' }}>
        <button className="btn btn-danger btn-sm" onClick={onDeleteClicked} type="button">
          <i className="bi-trash" />
          <span className="visually-hidden">Delete timespan</span>
        </button>
      </td>
    </tr>
  );
}

export default ScheduledValueTimespanRow;

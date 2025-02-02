import { DateTime } from 'luxon';

import { useAppDateTimeFormat, useISODateTimeInAppZone } from '../TimeUtils';
import { CellContext } from '@tanstack/react-table';

export function SingleLineTimestampCell<TData, TValue extends string | null | undefined>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  const value = getValue();
  const timestamp = useISODateTimeInAppZone(value ?? '');
  const format = useAppDateTimeFormat();

  if (!timestamp.isValid) {
    return <></>;
  }

  return <>{format(timestamp, 'compactDateTime')}</>;
}

export type TimestampCellProps = {
  value: string;
};

function TimestampCell({ value }: TimestampCellProps): JSX.Element {
  const timestamp = useISODateTimeInAppZone(value);
  const format = useAppDateTimeFormat();

  if (!timestamp.isValid) {
    return <></>;
  }

  return (
    <>
      {timestamp.toLocaleString(DateTime.DATE_MED)}
      <br />
      {format(timestamp, 'shortTimeWithSeconds').toLowerCase()}
    </>
  );
}

export default TimestampCell;

import { DateTime } from 'luxon';

import { useAppDateTimeFormat, useISODateTimeInAppZone } from '../TimeUtils';

export type SingleLineTimestampCellProps = {
  value: string;
};

export function SingleLineTimestampCell({ value }: SingleLineTimestampCellProps) {
  const timestamp = useISODateTimeInAppZone(value);
  const format = useAppDateTimeFormat();

  if (!timestamp.isValid) {
    return null;
  }

  return <>{format(timestamp, 'compactDateTime')}</>;
}

export type TimestampCellProps = {
  value: string;
};

function TimestampCell({ value }: TimestampCellProps) {
  const timestamp = useISODateTimeInAppZone(value);
  const format = useAppDateTimeFormat();

  if (!timestamp.isValid) {
    return null;
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

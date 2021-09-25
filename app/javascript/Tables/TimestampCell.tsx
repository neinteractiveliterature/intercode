import { DateTime } from 'luxon';

import { useAppDateTimeFormat, useISODateTimeInAppZone } from '../TimeUtils';

export type SingleLineTimestampCellProps = {
  value: string;
};

export function SingleLineTimestampCell({ value }: SingleLineTimestampCellProps): JSX.Element {
  const timestamp = useISODateTimeInAppZone(value);
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

// import { DateTime } from 'luxon';
import { parseISO, isValid, format, Locale } from 'date-fns';

// import { useISODateTimeInAppZone } from '../TimeUtils';

export type SingleLineTimestampCellProps = {
  value: string;
};

export function SingleLineTimestampCell({ value }: SingleLineTimestampCellProps) {
  const timestamp = parseISO(value);

  if (!isValid(timestamp)) {
    return null;
  }

  return <>{format(timestamp, 'YYYY-MM-DD HH:mm')}</>;
}

export type TimestampCellProps = {
  value: string;
};

function TimestampCell({ value }: TimestampCellProps) {
  const timestamp = parseISO(value);

  if (!isValid(timestamp)) {
    return null;
  }

  return (
    <>
      {timestamp.toLocaleString(DateTime.DATE_MED)}
      <br />
      {timestamp.toFormat('h:mm:ssa').toLowerCase()}
    </>
  );
}

export default TimestampCell;

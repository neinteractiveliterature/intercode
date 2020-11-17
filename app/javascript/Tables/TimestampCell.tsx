import { parseISO, isValid } from 'date-fns';
import { useAppDateFormat } from '../TimeUtils';

export type SingleLineTimestampCellProps = {
  value: string;
};

export function SingleLineTimestampCell({ value }: SingleLineTimestampCellProps) {
  const timestamp = parseISO(value);
  const format = useAppDateFormat();

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
  const format = useAppDateFormat();

  if (!isValid(timestamp)) {
    return null;
  }

  return (
    <>
      {format(timestamp, 'PP')}
      <br />
      {format(timestamp, 'h:mm:ssa').toLowerCase()}
    </>
  );
}

export default TimestampCell;

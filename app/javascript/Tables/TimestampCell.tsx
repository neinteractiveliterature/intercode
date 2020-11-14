import { useISODateTimeInAppZone } from '../TimeUtils';

export type SingleLineTimestampCellProps = {
  value: string;
};

export function SingleLineTimestampCell({ value }: SingleLineTimestampCellProps) {
  const timestamp = useISODateTimeInAppZone(value);

  if (!timestamp.isValid) {
    return null;
  }

  return <>{timestamp.format('YYYY-MM-DD HH:mm')}</>;
}

export type TimestampCellProps = {
  value: string;
};

function TimestampCell({ value }: TimestampCellProps) {
  const timestamp = useISODateTimeInAppZone(value);

  if (!timestamp.isValid) {
    return null;
  }

  return (
    <>
      {timestamp.format('ll')}
      <br />
      {timestamp.format('h:mm:ssa')}
    </>
  );
}

export default TimestampCell;

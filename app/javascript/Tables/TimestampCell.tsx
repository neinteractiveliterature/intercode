import { DateTime } from 'luxon';

import { useAppDateTimeFormat, useISODateTimeInAppZone } from '../TimeUtils';
import { CellContext } from '@tanstack/react-table';

export function SingleLineTimestampCell<TData, TValue extends string | null | undefined>({
  getValue,
}: CellContext<TData, TValue>): React.JSX.Element {
  const value = getValue();
  const timestamp = useISODateTimeInAppZone(value ?? '');
  const format = useAppDateTimeFormat();

  if (!timestamp.isValid) {
    return <></>;
  }

  return <>{format(timestamp, 'compactDateTime')}</>;
}

function TimestampCell<TData, TValue extends string>({ getValue }: CellContext<TData, TValue>): React.JSX.Element {
  const value = getValue();
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

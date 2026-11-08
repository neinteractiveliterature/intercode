import { DateTime } from 'luxon';

import { useAppDateTimeFormat, useISODateTimeInAppZone } from '../TimeUtils';
import { type RowData } from '@tanstack/react-table';
import { type AppCellContext } from './tableFeatures';

export function SingleLineTimestampCell<TData extends RowData, TValue extends string | null | undefined>({
  getValue,
}: AppCellContext<TData, TValue>): React.JSX.Element {
  const value = getValue();
  const timestamp = useISODateTimeInAppZone(value ?? '');
  const format = useAppDateTimeFormat();

  if (!timestamp.isValid) {
    return <></>;
  }

  return <>{format(timestamp, 'compactDateTime')}</>;
}

function TimestampCell<TData extends RowData, TValue extends string>({
  getValue,
}: AppCellContext<TData, TValue>): React.JSX.Element {
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

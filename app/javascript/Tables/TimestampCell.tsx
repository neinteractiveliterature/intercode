import React from 'react';
import { DateTime } from 'luxon';

import { useISODateTimeInAppZone } from '../TimeUtils';

export type SingleLineTimestampCellProps = {
  value: string;
};

export function SingleLineTimestampCell({ value }: SingleLineTimestampCellProps) {
  const timestamp = useISODateTimeInAppZone(value);

  if (!timestamp.isValid) {
    return null;
  }

  return <>{timestamp.toFormat('yyyy-MM-dd HH:mm')}</>;
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
      {timestamp.toLocaleString(DateTime.DATE_MED)}
      <br />
      {timestamp.toFormat('h:mm:ssa').toLowerCase()}
    </>
  );
}

export default TimestampCell;

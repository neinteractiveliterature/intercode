import React, { useMemo, useContext } from 'react';
import moment from 'moment-timezone';
import AppRootContext from '../../AppRootContext';

export function describeDate(value: string, timezoneName: string) {
  return moment.tz(value, timezoneName).format('dddd, MMMM D, YYYY');
}

export type DateItemDisplayProps = {
  value: string,
};

function DateItemDisplay({ value }: DateItemDisplayProps) {
  const { timezoneName } = useContext(AppRootContext);
  const formattedDate = useMemo(
    () => describeDate(value, timezoneName),
    [timezoneName, value],
  );

  return <>{formattedDate}</>;
}

export default DateItemDisplay;

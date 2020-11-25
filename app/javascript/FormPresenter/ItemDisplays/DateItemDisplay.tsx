import { useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import AppRootContext from '../../AppRootContext';
import { formatLCM } from '../../TimeUtils';

export function describeDate(value: string, timezoneName: string) {
  return formatLCM(DateTime.fromISO(value, { zone: timezoneName }), 'cccc, MMMM d, yyyy');
}

export type DateItemDisplayProps = {
  value: string;
};

function DateItemDisplay({ value }: DateItemDisplayProps) {
  const { timezoneName } = useContext(AppRootContext);
  const formattedDate = useMemo(() => describeDate(value, timezoneName), [timezoneName, value]);

  return <>{formattedDate}</>;
}

export default DateItemDisplay;

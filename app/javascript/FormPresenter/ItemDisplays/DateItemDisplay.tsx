import { useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import AppRootContext from '../../AppRootContext';
import { useAppDateTimeFormat } from '../../TimeUtils';

export function describeDate(
  value: string,
  timezoneName: string,
  format: ReturnType<typeof useAppDateTimeFormat>,
): string {
  return format(DateTime.fromISO(value, { zone: timezoneName }), 'longWeekdayDate');
}

export type DateItemDisplayProps = {
  value: string;
};

function DateItemDisplay({ value }: DateItemDisplayProps): React.JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const formattedDate = useMemo(() => describeDate(value, timezoneName, format), [timezoneName, value, format]);

  return <>{formattedDate}</>;
}

export default DateItemDisplay;

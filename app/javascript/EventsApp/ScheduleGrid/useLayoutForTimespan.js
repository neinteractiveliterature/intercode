/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

function getMemoizationKeyForTimespan(timespan) {
  if (!timespan) {
    return '';
  }

  return [
    timespan.start ? timespan.start.toISOString() : '',
    timespan.finish ? timespan.finish.toISOString() : '',
  ].join('/');
}

export default function useLayoutForTimespan(schedule, timespan) {
  const timespanKey = getMemoizationKeyForTimespan(timespan);

  const minTimespan = useMemo(
    () => {
      if (!timespan) {
        return null;
      }

      const min = timespan.clone();
      min.start.add(3, 'hours'); // start grid at 9am unless something is earlier
      min.finish.subtract(6, 'hours'); // end grid at midnight unless something is earlier
      if (min.start.isAfter(min.finish)) {
        return timespan;
      }
      return min;
    },
    [timespanKey],
  );

  const layout = useMemo(
    () => (minTimespan
      ? schedule.buildLayoutForTimespanRange(
        minTimespan,
        timespan,
      )
      : null
    ),
    [minTimespan, schedule, timespanKey],
  );

  return layout;
}

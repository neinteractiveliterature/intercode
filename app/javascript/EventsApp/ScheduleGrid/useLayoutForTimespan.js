/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import moment from 'moment-timezone';

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
      if (min.start.hour() < 9) {
        min.start.set({ hour: 9 }); // start grid at 9am unless something is earlier
      }
      if (min.finish.date() !== min.start.date()) {
        // end grid at midnight unless something is earlier
        min.finish = moment(min.start).add(1, 'day').set({ hour: 0, minute: 0, second: 0 });
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

/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

import { getMemoizationKeyForTimespan } from '../../TimespanUtils';
import Schedule from './Schedule';
import { FiniteTimespan } from '../../Timespan';

export default function useLayoutForTimespan(schedule: Schedule, timespan: FiniteTimespan) {
  const timespanKey = getMemoizationKeyForTimespan(timespan);

  const minTimespan = useMemo(
    () => {
      if (!timespan) {
        return null;
      }

      const min = timespan.clone();
      // start grid at 9am unless something is earlier
      min.start = min.start.plus({ hours: 3 });
      // end grid at midnight unless something is earlier
      min.finish = min.finish.minus({ hours: 6 });
      if (min.start > min.finish) {
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

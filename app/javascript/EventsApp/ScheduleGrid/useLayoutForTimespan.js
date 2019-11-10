/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

import { getMemoizationKeyForTimespan } from '../../TimespanUtils';

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

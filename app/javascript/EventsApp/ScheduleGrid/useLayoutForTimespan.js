/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

export default function useLayoutForTimespan(schedule, timespan) {
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
    [timespan.start.toISOString(), timespan.finish.toISOString()],
  );

  const layout = useMemo(
    () => (minTimespan
      ? schedule.buildLayoutForTimespanRange(
        minTimespan,
        timespan,
      )
      : null
    ),
    [minTimespan, schedule, timespan.start.toISOString(), timespan.finish.toISOString()],
  );

  return layout;
}

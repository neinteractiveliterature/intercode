/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { FiniteTimespan } from '../../Timespan';

import { getMemoizationKeyForTimespan } from '../../TimespanUtils';
import Schedule from './Schedule';

export default function useLayoutForTimespan(schedule: Schedule, timespan?: FiniteTimespan) {
  const timespanKey = getMemoizationKeyForTimespan(timespan);

  const minTimespan = useMemo(() => {
    if (!timespan) {
      return undefined;
    }

    const min = timespan.clone();
    min.start.add(3, 'hours'); // start grid at 9am unless something is earlier
    min.finish.subtract(6, 'hours'); // end grid at midnight unless something is earlier
    if (min.start.isAfter(min.finish)) {
      return timespan;
    }
    return min;
  }, [timespanKey]);

  const layout = useMemo(
    () => (minTimespan ? schedule.buildLayoutForTimespanRange(minTimespan, timespan!) : undefined),
    [minTimespan, schedule, timespanKey],
  );

  return layout;
}

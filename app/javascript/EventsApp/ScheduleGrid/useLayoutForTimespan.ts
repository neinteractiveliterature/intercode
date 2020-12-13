/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import Timespan, { FiniteTimespan } from '../../Timespan';

import { getMemoizationKeyForTimespan } from '../../TimespanUtils';
import Schedule from './Schedule';

export default function useLayoutForTimespan(schedule: Schedule, timespan?: FiniteTimespan) {
  const timespanKey = getMemoizationKeyForTimespan(timespan);

  const minTimespan = useMemo(() => {
    if (!timespan) {
      return undefined;
    }

    const minStart = timespan.start.plus({ hours: 3 }); // start grid at 9am unless something is earlie
    const minFinish = timespan.finish.minus({ hours: 6 }); // end grid at midnight unless something is earlier

    if (minStart > minFinish) {
      return timespan;
    }

    return Timespan.finiteFromDateTimes(minStart, minFinish);
  }, [timespanKey]);

  const layout = useMemo(
    () => (minTimespan ? schedule.buildLayoutForTimespanRange(minTimespan, timespan!) : undefined),
    [minTimespan, schedule, timespanKey],
  );

  return layout;
}

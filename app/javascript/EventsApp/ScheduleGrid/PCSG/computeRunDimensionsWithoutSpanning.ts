import ColumnReservationSet from './ColumnReservationSet';
import { ScheduleLayoutResult } from './ScheduleLayoutResult';
import ScheduleBlock from './ScheduleBlock';

const MIN_LENGTH = 30 * 60 * 1000; // 30 minutes in milliseconds

function computeRunDimensionsWithoutSpanning(scheduleBlock: ScheduleBlock): ScheduleLayoutResult {
  const columnReservations = new ColumnReservationSet();
  const myLength = scheduleBlock.timespan.getLength('millisecond');
  let maxColumns = 0;

  const runDimensions = scheduleBlock.getTimeSortedRunIds().map((runId) => {
    const runTimespan = scheduleBlock.runTimespans.get(runId)!;
    const now = runTimespan.start;
    columnReservations.expire(now);

    const displayLength = Math.max(MIN_LENGTH, runTimespan.getLength('millisecond'));
    const displayTimespan = runTimespan.clone();
    displayTimespan.finish = displayTimespan.start.clone().add(displayLength);

    const laneIndex = columnReservations.findFreeColumnForTimespan(runTimespan);
    columnReservations.reserve(laneIndex, runId, displayTimespan);

    if (laneIndex + 1 > maxColumns) {
      maxColumns = laneIndex + 1;
    }

    return {
      runId,
      timespan: runTimespan,
      laneIndex,
      timeAxisStartPercent:
        (runTimespan.start.diff(scheduleBlock.timespan.start) / myLength) * 100.0,
      timeAxisSizePercent: (displayLength / myLength) * 100.0,
    };
  });

  return { runDimensions, laneCount: maxColumns };
}

export default computeRunDimensionsWithoutSpanning;

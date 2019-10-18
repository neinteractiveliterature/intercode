import ColumnReservationSet from './ColumnReservationSet';
import ScheduleLayoutResult from './ScheduleLayoutResult';
import RunDimensions from './RunDimensions';

const MIN_LENGTH = 30 * 60 * 1000; // 30 minutes in milliseconds

function computeRunDimensionsWithoutSpanning(scheduleBlock) {
  const columnReservations = new ColumnReservationSet();
  const myLength = scheduleBlock.timespan.getLength();
  let maxColumns = 0;

  const runDimensions = scheduleBlock.getTimeSortedEventRuns().map((eventRun) => {
    const now = eventRun.timespan.start;
    columnReservations.expire(now);

    const displayLength = Math.max(MIN_LENGTH, eventRun.timespan.getLength());
    const displayTimespan = eventRun.timespan.clone();
    displayTimespan.finish = displayTimespan.start.clone().add(displayLength);

    const laneIndex = columnReservations.findFreeColumnForEventRun(eventRun);
    columnReservations.reserve(laneIndex, eventRun, displayTimespan);

    if (laneIndex + 1 > maxColumns) {
      maxColumns = laneIndex + 1;
    }

    return new RunDimensions(
      eventRun,
      laneIndex,
      (eventRun.timespan.start.diff(scheduleBlock.timespan.start) / myLength) * 100.0,
      (displayLength / myLength) * 100.0,
    );
  });

  return new ScheduleLayoutResult(runDimensions, maxColumns);
}

export default computeRunDimensionsWithoutSpanning;

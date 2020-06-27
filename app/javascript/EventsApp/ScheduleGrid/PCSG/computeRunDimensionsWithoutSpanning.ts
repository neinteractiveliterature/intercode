import ColumnReservationSet from './ColumnReservationSet';
import ScheduleLayoutResult from './ScheduleLayoutResult';
import RunDimensions from './RunDimensions';
import ScheduleBlock from './ScheduleBlock';

const MIN_LENGTH = 30 * 60 * 1000; // 30 minutes in milliseconds

function computeRunDimensionsWithoutSpanning(scheduleBlock: ScheduleBlock) {
  const columnReservations = new ColumnReservationSet();
  const myLength = scheduleBlock.timespan.getLength('millisecond');
  let maxColumns = 0;

  const runDimensions = scheduleBlock.getTimeSortedEventRuns().map((eventRun) => {
    const now = eventRun.timespan.start;
    columnReservations.expire(now);

    const displayLength = Math.max(MIN_LENGTH, eventRun.timespan.getLength('millisecond'));
    const displayTimespan = eventRun.timespan.clone();
    displayTimespan.finish = displayTimespan.start.plus({ milliseconds: displayLength });

    const laneIndex = columnReservations.findFreeColumnForEventRun(eventRun);
    columnReservations.reserve(laneIndex, eventRun, displayTimespan);

    if (laneIndex + 1 > maxColumns) {
      maxColumns = laneIndex + 1;
    }

    return new RunDimensions(
      eventRun,
      laneIndex,
      (eventRun.timespan.start.diff(scheduleBlock.timespan.start).valueOf() / myLength) * 100.0,
      (displayLength / myLength) * 100.0,
    );
  });

  return new ScheduleLayoutResult(runDimensions, maxColumns);
}

export default computeRunDimensionsWithoutSpanning;

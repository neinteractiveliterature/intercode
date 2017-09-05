// @flow

import ColumnReservationSet from './ColumnReservationSet';
import ScheduleBlock from './ScheduleBlock';
import ScheduleLayoutResult from './ScheduleLayoutResult';
import RunDimensions from './RunDimensions';

function computeRunDimensionsWithoutSpanning(scheduleBlock: ScheduleBlock): ScheduleLayoutResult {
  const columnReservations = new ColumnReservationSet();
  const myLength = scheduleBlock.timespan.getLength();
  let maxColumns = 0;

  const runDimensions = scheduleBlock.getTimeSortedEventRuns().map((eventRun) => {
    const now = eventRun.timespan.start;
    columnReservations.expire(now);

    const laneIndex = columnReservations.findFreeColumnForEventRun(eventRun);
    columnReservations.reserve(laneIndex, eventRun);

    if (laneIndex + 1 > maxColumns) {
      maxColumns = laneIndex + 1;
    }

    return new RunDimensions(
      eventRun,
      laneIndex,
      (eventRun.timespan.start.diff(scheduleBlock.timespan.start) / myLength) * 100.0,
      (eventRun.timespan.getLength() / myLength) * 100.0,
    );
  });

  return new ScheduleLayoutResult(runDimensions, maxColumns);
}

export default computeRunDimensionsWithoutSpanning;

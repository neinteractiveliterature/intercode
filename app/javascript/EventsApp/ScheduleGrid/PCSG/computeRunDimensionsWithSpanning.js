import ColumnReservationSet from './ColumnReservationSet';
import ScheduleLayoutResult from './ScheduleLayoutResult';
import RunDimensions from './RunDimensions';

function computeRunDimensionsWithSpanning(scheduleBlock) {
  const columnReservations = new ColumnReservationSet();
  const runDimensions = new Map();
  const myLength = scheduleBlock.timespan.getLength();
  const upcomingRuns = scheduleBlock.getTimeSortedEventRuns();
  let maxColumns = 0;

  let lastColumn = 0;
  while (upcomingRuns.length > 0) {
    const now = upcomingRuns[0].timespan.start;
    const runsStartingNow = [];
    while (upcomingRuns.length > 0 && upcomingRuns[0].timespan.start.isSame(now)) {
      runsStartingNow.push(upcomingRuns.shift());
    }

    columnReservations.expire(now);

    if (columnReservations.isEmpty()) {
      lastColumn = 0;
    }

    runsStartingNow.forEach((run) => {
      if (!columnReservations.isColumnReservedForRunId(run.runId)) {
        const columnNumber = columnReservations.findFreeColumnForEventRun(run);
        columnReservations.reserve(columnNumber, run);
      }
    });

    if (!columnReservations.isEmpty()) {
      let planUntil = columnReservations.getFinishTime();
      let addedUpcomingReservations = false;

      [...upcomingRuns].forEach((upcomingRun) => {
        if (upcomingRun.timespan.start.isSameOrAfter(planUntil)) {
          return;
        }

        if (!columnReservations.isColumnReservedForRunId(upcomingRun.runId)) {
          const columnNumber = columnReservations.findFreeColumnForEventRun(upcomingRun);
          columnReservations.reserve(columnNumber, upcomingRun);
          addedUpcomingReservations = true;
        }

        if (planUntil != null && planUntil.isBefore(upcomingRun.timespan.finish)) {
          planUntil = upcomingRun.timespan.finish;
        }
      });

      if (addedUpcomingReservations) {
        columnReservations.sortColumns();
      }

      const newLastColumn = columnReservations.getLastReservedColumnNumber();
      if (newLastColumn != null && lastColumn < newLastColumn) {
        lastColumn = newLastColumn;
      }
    }

    if (runsStartingNow.length > 0 && lastColumn >= maxColumns) {
      maxColumns = lastColumn + 1;
    }

    const sortedCurrentRuns = [];
    runsStartingNow.forEach((runStartingNow) => {
      const columnNumber = columnReservations.columnNumberByRunId.get(runStartingNow.runId);
      if (columnNumber != null) {
        sortedCurrentRuns[columnNumber] = runStartingNow;
      }
    });

    const eventWidth = 100.0 / (lastColumn + 1);
    let left = 0.0;
    let lastColumnNumber = 0;
    for (let columnNumber = 0; columnNumber < sortedCurrentRuns.length; columnNumber += 1) {
      const currentRun = sortedCurrentRuns[columnNumber];

      if (currentRun != null) {
        if (columnNumber - lastColumnNumber > 0) {
          left += (columnNumber - lastColumnNumber) * eventWidth;
        }
        let span = 1;

        let checkColnum;
        for (checkColnum = columnNumber + 1; checkColnum <= lastColumn; checkColnum += 1) {
          // check columns for spannability
          if (columnReservations.columnFreeBetween(checkColnum, currentRun.timespan)) {
            span += 1;
          } else {
            break;
          }
        }

        runDimensions.set(
          currentRun.runId,
          new RunDimensions(
            currentRun,
            columnNumber,
            (currentRun.timespan.start.diff(this.timespan.start) / myLength) * 100.0,
            (currentRun.timespan.getLength() / myLength) * 100.0,
            left,
            eventWidth * span,
          ),
        );

        if (span > 1) {
          left += (span - 1) * eventWidth;
        }
        lastColumnNumber = columnNumber;
      }
    }
  }

  return new ScheduleLayoutResult(
    [...runDimensions.values()],
    maxColumns,
  );
}

export default computeRunDimensionsWithSpanning;

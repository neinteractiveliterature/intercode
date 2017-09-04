// @flow

import moment from 'moment';
import ColumnReservationSet from './ColumnReservationSet';
import EventRun from './EventRun';
import RunDimensions from './RunDimensions';
import Timespan from './Timespan';

export class ScheduleLayoutResult {
  runDimensions: Array<RunDimensions>;
  laneCount: number;

  constructor(runDimensions: Array<RunDimensions>, laneCount: number) {
    this.runDimensions = runDimensions;
    this.laneCount = laneCount;
  }
}

class ScheduleBlock {
  timespan: Timespan;
  interval: moment.Duration;
  eventRuns: Array<EventRun>;
  maxColumns: number;

  constructor(timespan: Timespan, eventRuns: Array<EventRun> = []) {
    this.eventRuns = [];
    this.timespan = timespan;
    this.interval = moment.duration(1, 'hour');
    eventRuns.forEach((eventRun) => { this.addEventRun(eventRun); });
  }

  addEventRun(eventRun: EventRun) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(eventRun.timespan);
  }

  getTimeSortedEventRuns(): Array<EventRun> {
    return [...this.eventRuns].sort(
      (a, b) => {
        const timeDiff = a.timespan.start.diff(b.timespan.start);
        
        if (timeDiff === 0) {
          // as a tiebreaker, sort longer events first
          return b.timespan.finish.diff(a.timespan.finish);
        }

        return timeDiff;
      }
    );
  }

  computeRunDimensionsWithoutSpanning(): ScheduleLayoutResult {
    const columnReservations = new ColumnReservationSet();
    const myLength = this.timespan.getLength();
    let maxColumns = 0;

    const runDimensions = this.getTimeSortedEventRuns().map((eventRun) => {
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
        (eventRun.timespan.start.diff(this.timespan.start) / myLength) * 100.0,
        (eventRun.timespan.getLength() / myLength) * 100.0,
      );
    });

    return new ScheduleLayoutResult(runDimensions, maxColumns);
  }

  computeRunDimensionsWithSpanning(): Map<number, RunDimensions> {
    const columnReservations = new ColumnReservationSet();
    const runDimensions: Map<number, RunDimensions> = new Map();
    const myLength = this.timespan.getLength();
    const upcomingRuns = this.getTimeSortedEventRuns();

    this.maxColumns = 0;
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

        // if (addedUpcomingReservations) {
        //   columnReservations.sortColumns();
        // }

        const newLastColumn = columnReservations.getLastReservedColumnNumber();
        if (newLastColumn != null && lastColumn < newLastColumn) {
          lastColumn = newLastColumn;
        }
      }

      if (runsStartingNow.length > 0 && lastColumn >= this.maxColumns) {
        this.maxColumns = lastColumn + 1;
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
      sortedCurrentRuns.forEach((currentRun, columnNumber) => {
        if (currentRun == null) {
          return;
        }

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
      });
    }

    return runDimensions;
  }
}

export default ScheduleBlock;

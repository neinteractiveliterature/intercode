import { DateTime } from 'luxon';

import ColumnReservation from './ColumnReservation';
import { FiniteTimespan } from '../../../Timespan';
import EventRun from './EventRun';

// helper function for sorting columns - should help eliminate holes
// in the schedule by allowing events to span columns if possible
//
// reservations that start earlier go first.
// in case of two reservations starting at the same time, reservations that end
// later go first.
// finally, reservations with fewer events go first.
function compareReservationsForSort(a?: ColumnReservation | null, b?: ColumnReservation | null) {
  if (a == null && b == null) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  if (+a.timespan.start !== +b.timespan.start) {
    return a.timespan.start.diff(b.timespan.start).valueOf();
  }

  if (+a.timespan.finish !== +b.timespan.finish) {
    return b.timespan.finish.diff(a.timespan.finish).valueOf();
  }

  return a.eventRuns.length - b.eventRuns.length;
}

class ColumnReservationSet {
  reservations: (ColumnReservation | null)[];

  columnNumberByRunId: Map<number, number>;

  constructor() {
    this.clear();
  }

  clear() {
    this.reservations = [];
    this.columnNumberByRunId = new Map();
  }

  reserve(columnNumber: number, eventRun: EventRun, timespan: FiniteTimespan) {
    const existingReservation = this.reservations[columnNumber];
    if (existingReservation != null) {
      existingReservation.addEventRun(eventRun, timespan);
    } else {
      this.reservations[columnNumber] = new ColumnReservation(eventRun, timespan);
    }

    this.columnNumberByRunId.set(eventRun.runId, columnNumber);
  }

  getReservationForColumn(columnNumber: number) {
    return this.reservations[columnNumber];
  }

  getReservedColumnNumbers() {
    const reservedColumnNumbers = this.reservations.map((reservation, i) => {
      if (reservation != null) {
        return i;
      }

      return -1;
    });

    return (reservedColumnNumbers.filter((columnNumber) => columnNumber !== -1));
  }

  getLastReservedColumnNumber() {
    const reservedColumnNumbers = this.getReservedColumnNumbers();
    return reservedColumnNumbers[reservedColumnNumbers.length - 1];
  }

  expire(cutoff: DateTime) {
    this.getReservedColumnNumbers().forEach((columnNumber) => {
      const reservation = this.reservations[columnNumber];
      if (reservation == null) {
        return;
      }

      if (reservation.timespan.finish <= cutoff) {
        this.reservations[columnNumber] = null;
      }
    });
  }

  isEmpty() {
    return this.reservations.every((reservation) => reservation == null);
  }

  nextFreeColumn() {
    const foundNull = this.reservations.findIndex((reservation) => reservation == null);
    if (foundNull !== -1) {
      return foundNull;
    }

    return this.reservations.length;
  }

  getFinishTime() {
    let lastFinish;
    this.reservations.forEach((reservation) => {
      if (reservation == null) {
        return;
      }

      if (lastFinish == null || lastFinish.isBefore(reservation.timespan.finish)) {
        lastFinish = reservation.timespan.finish;
      }
    });

    return lastFinish;
  }

  findFreeColumnForEventRun(eventRun) {
    let columnNumber;

    this.reservations.forEach((reservation, i) => {
      if (columnNumber != null) {
        return;
      }

      if (reservation == null || !reservation.timespan.overlapsTimespan(eventRun.timespan)) {
        columnNumber = i;
      }
    });

    if (columnNumber != null) {
      return columnNumber;
    }

    return this.reservations.length;
  }

  columnFreeBetween(columnNumber, timespan) {
    const reservation = this.reservations[columnNumber];

    return (reservation == null || !reservation.timespan.overlapsTimespan(timespan));
  }

  recalculateRunColumns() {
    this.columnNumberByRunId = new Map();
    this.reservations.forEach((reservation, columnNumber) => {
      if (reservation == null) {
        return;
      }

      reservation.eventRuns.forEach((eventRun) => {
        this.columnNumberByRunId.set(eventRun.runId, columnNumber);
      });
    });
  }

  sortColumns() {
    this.reservations.sort(compareReservationsForSort);
    this.recalculateRunColumns();
  }

  isColumnReservedForRunId(runId) {
    return this.columnNumberByRunId.has(runId);
  }
}

export default ColumnReservationSet;

// @flow

import moment from 'moment-timezone';
import ColumnReservation from './ColumnReservation';
import EventRun from './EventRun';
import Timespan from './Timespan';

// helper function for sorting columns - should help eliminate holes
// in the schedule by allowing events to span columns if possible
//
// reservations that start earlier go first.
// in case of two reservations starting at the same time, reservations that end
// later go first.
// finally, reservations with fewer events go first.
function compareReservationsForSort(a: ?ColumnReservation, b: ?ColumnReservation): number {
  if (a == null && b == null) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  if (!a.timespan.start.isSame(b.timespan.start)) {
    return a.timespan.start.diff(b.timespan.start);
  }

  if (!a.timespan.finish.isSame(b.timespan.finish)) {
    return b.timespan.finish.diff(a.timespan.finish);
  }

  return a.eventRuns.length - b.eventRuns.length;
}

class ColumnReservationSet {
  reservations: Array<?ColumnReservation>;
  columnNumberByRunId: Map<number, number>;

  constructor() {
    this.clear();
  }

  clear() {
    this.reservations = [];
    this.columnNumberByRunId = new Map();
  }

  reserve(columnNumber: number, eventRun: EventRun) {
    if (this.reservations[columnNumber] != null) {
      this.reservations[columnNumber].addEventRun(eventRun);
    } else {
      this.reservations[columnNumber] = new ColumnReservation(eventRun);
    }

    this.columnNumberByRunId.set(eventRun.runId, columnNumber);
  }

  getReservationForColumn(columnNumber: number): ?ColumnReservation {
    return this.reservations[columnNumber];
  }

  getReservedColumnNumbers(): Array<number> {
    const reservedColumnNumbers: Array<number> = this.reservations.map((reservation, i) => {
      if (reservation != null) {
        return i;
      }

      return -1;
    });

    return (reservedColumnNumbers.filter(columnNumber => columnNumber !== -1));
  }

  getLastReservedColumnNumber(): ?number {
    const reservedColumnNumbers = this.getReservedColumnNumbers();
    return reservedColumnNumbers[reservedColumnNumbers.length - 1];
  }

  expire(cutoff: moment) {
    this.getReservedColumnNumbers().forEach((columnNumber) => {
      const reservation = this.reservations[columnNumber];
      if (reservation == null) {
        return;
      }

      if (reservation.timespan.finish.isSameOrBefore(cutoff)) {
        this.reservations[columnNumber] = null;
      }
    });
  }

  isEmpty(): boolean {
    return this.reservations.every(reservation => reservation == null);
  }

  nextFreeColumn(): number {
    const foundNull = this.reservations.findIndex(reservation => reservation == null);
    if (foundNull !== -1) {
      return foundNull;
    }

    return this.reservations.length;
  }

  getFinishTime(): ?moment {
    let lastFinish: ?moment;
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

  findFreeColumnForEventRun(eventRun: EventRun): number {
    let columnNumber: ?number;

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

  columnFreeBetween(columnNumber: number, timespan: Timespan): boolean {
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

  isColumnReservedForRunId(runId: number): boolean {
    return this.columnNumberByRunId.has(runId);
  }
}

export default ColumnReservationSet;

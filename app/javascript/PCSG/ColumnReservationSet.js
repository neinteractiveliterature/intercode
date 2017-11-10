import ColumnReservation from './ColumnReservation';

// helper function for sorting columns - should help eliminate holes
// in the schedule by allowing events to span columns if possible
//
// reservations that start earlier go first.
// in case of two reservations starting at the same time, reservations that end
// later go first.
// finally, reservations with fewer events go first.
function compareReservationsForSort(a, b) {
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
  constructor() {
    this.clear();
  }

  clear() {
    this.reservations = [];
    this.columnNumberByRunId = new Map();
  }

  reserve(columnNumber, eventRun) {
    if (this.reservations[columnNumber] != null) {
      this.reservations[columnNumber].addEventRun(eventRun);
    } else {
      this.reservations[columnNumber] = new ColumnReservation(eventRun);
    }

    this.columnNumberByRunId.set(eventRun.runId, columnNumber);
  }

  getReservationForColumn(columnNumber) {
    return this.reservations[columnNumber];
  }

  getReservedColumnNumbers() {
    const reservedColumnNumbers = this.reservations.map((reservation, i) => {
      if (reservation != null) {
        return i;
      }

      return -1;
    });

    return (reservedColumnNumbers.filter(columnNumber => columnNumber !== -1));
  }

  getLastReservedColumnNumber() {
    const reservedColumnNumbers = this.getReservedColumnNumbers();
    return reservedColumnNumbers[reservedColumnNumbers.length - 1];
  }

  expire(cutoff) {
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

  isEmpty() {
    return this.reservations.every(reservation => reservation == null);
  }

  nextFreeColumn() {
    const foundNull = this.reservations.findIndex(reservation => reservation == null);
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

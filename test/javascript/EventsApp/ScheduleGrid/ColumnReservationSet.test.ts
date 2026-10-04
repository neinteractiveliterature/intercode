import { DateTime } from 'luxon';
import ColumnReservationSet from '../../../../app/javascript/EventsApp/ScheduleGrid/ScheduleLayout/ColumnReservationSet';
import Timespan from '../../../../app/javascript/Timespan';

function span(startHour: number, finishHour: number) {
  return Timespan.finiteFromStrings(
    `2026-01-02T${String(startHour).padStart(2, '0')}:00:00Z`,
    `2026-01-02T${String(finishHour).padStart(2, '0')}:00:00Z`,
  );
}

function at(hour: number) {
  return DateTime.fromISO(`2026-01-02T${String(hour).padStart(2, '0')}:00:00Z`);
}

describe('ColumnReservationSet', () => {
  let set: ColumnReservationSet;

  beforeEach(() => {
    set = new ColumnReservationSet();
  });

  it('starts out empty', () => {
    expect(set.isEmpty()).toBe(true);
    expect(set.getReservedColumnNumbers()).toEqual([]);
    expect(set.getFinishTime()).toBeUndefined();
    expect(set.nextFreeColumn()).toBe(0);
  });

  describe('reserve', () => {
    it('reserves a column for a run', () => {
      set.reserve(0, 'run-1', span(10, 12));

      expect(set.isEmpty()).toBe(false);
      expect(set.getReservationForColumn(0)?.runIds).toEqual(['run-1']);
      expect(set.isColumnReservedForRunId('run-1')).toBe(true);
      expect(set.isColumnReservedForRunId('run-2')).toBe(false);
    });

    it('adds a second run to an already-reserved column, growing the reserved timespan to fit', () => {
      set.reserve(0, 'run-1', span(10, 12));
      set.reserve(0, 'run-2', span(12, 15));

      const reservation = set.getReservationForColumn(0);
      expect(reservation?.runIds).toEqual(['run-1', 'run-2']);
      expect(reservation?.timespan.start.toMillis()).toBe(at(10).toMillis());
      expect(reservation?.timespan.finish.toMillis()).toBe(at(15).toMillis());
    });

    it('can reserve columns out of order, leaving gaps', () => {
      set.reserve(2, 'run-1', span(10, 12));

      expect(set.getReservedColumnNumbers()).toEqual([2]);
      expect(set.getLastReservedColumnNumber()).toBe(2);
      expect(set.nextFreeColumn()).toBe(0);
    });
  });

  describe('nextFreeColumn', () => {
    it('returns the first empty column, or one past the end if they are all taken', () => {
      set.reserve(0, 'run-1', span(10, 12));
      set.reserve(1, 'run-2', span(10, 12));
      expect(set.nextFreeColumn()).toBe(2);

      set.expire(at(13));
      expect(set.nextFreeColumn()).toBe(0);
    });
  });

  describe('findFreeColumnForTimespan', () => {
    it('returns the first column that has nothing overlapping the timespan', () => {
      set.reserve(0, 'run-1', span(10, 12));
      set.reserve(1, 'run-2', span(14, 16));

      expect(set.findFreeColumnForTimespan(span(11, 13))).toBe(1);
      expect(set.findFreeColumnForTimespan(span(12, 14))).toBe(0);
    });

    it('returns a new column if every column overlaps', () => {
      set.reserve(0, 'run-1', span(10, 12));
      set.reserve(1, 'run-2', span(11, 13));

      expect(set.findFreeColumnForTimespan(span(11, 12))).toBe(2);
    });

    it('returns column 0 when nothing has been reserved', () => {
      expect(set.findFreeColumnForTimespan(span(10, 12))).toBe(0);
    });

    it('treats a timespan that starts exactly when a reservation ends as not overlapping', () => {
      set.reserve(0, 'run-1', span(10, 12));

      expect(set.findFreeColumnForTimespan(span(12, 14))).toBe(0);
    });
  });

  describe('columnFreeBetween', () => {
    it('is true for empty columns and columns with no overlap, false otherwise', () => {
      set.reserve(0, 'run-1', span(10, 12));

      expect(set.columnFreeBetween(0, span(11, 13))).toBe(false);
      expect(set.columnFreeBetween(0, span(12, 13))).toBe(true);
      expect(set.columnFreeBetween(1, span(10, 12))).toBe(true);
    });
  });

  describe('expire', () => {
    it('frees columns whose reservations have finished by the cutoff', () => {
      set.reserve(0, 'run-1', span(10, 12));
      set.reserve(1, 'run-2', span(10, 14));

      set.expire(at(12));

      expect(set.getReservationForColumn(0)).toBeNull();
      expect(set.getReservationForColumn(1)).not.toBeNull();
      expect(set.getReservedColumnNumbers()).toEqual([1]);
    });

    it('keeps reservations that finish after the cutoff', () => {
      set.reserve(0, 'run-1', span(10, 12));

      set.expire(at(11));

      expect(set.getReservedColumnNumbers()).toEqual([0]);
    });

    it('leaves the set empty once everything has expired', () => {
      set.reserve(0, 'run-1', span(10, 12));
      set.expire(at(20));

      expect(set.isEmpty()).toBe(true);
    });
  });

  describe('getFinishTime', () => {
    it('returns the latest finish across all reservations, ignoring freed columns', () => {
      set.reserve(0, 'run-1', span(10, 12));
      set.reserve(1, 'run-2', span(10, 16));
      set.reserve(2, 'run-3', span(10, 14));
      expect(set.getFinishTime()?.toMillis()).toBe(at(16).toMillis());

      set.expire(at(17));
      set.reserve(0, 'run-4', span(10, 13));
      expect(set.getFinishTime()?.toMillis()).toBe(at(13).toMillis());
    });
  });

  describe('sortColumns', () => {
    it('puts earlier-starting reservations first, then longer ones, then ones with fewer runs, then empty columns', () => {
      set.reserve(0, 'late', span(12, 14));
      set.reserve(1, 'short-early', span(10, 11));
      set.reserve(2, 'long-early', span(10, 13));
      set.reserve(4, 'single', span(15, 16));
      set.reserve(4, 'double', span(16, 17));
      set.reserve(5, 'single-2', span(15, 17));

      set.sortColumns();

      expect(Array.from(set.reservations, (reservation) => reservation?.runIds ?? null)).toEqual([
        ['long-early'],
        ['short-early'],
        ['late'],
        ['single-2'],
        ['single', 'double'],
        null,
      ]);
    });

    it('recalculates which column each run is in', () => {
      set.reserve(0, 'late', span(12, 14));
      set.reserve(1, 'early', span(10, 11));

      set.sortColumns();

      expect(set.columnNumberByRunId.get('early')).toBe(0);
      expect(set.columnNumberByRunId.get('late')).toBe(1);
    });
  });

  describe('clear', () => {
    it('forgets everything', () => {
      set.reserve(0, 'run-1', span(10, 12));

      set.clear();

      expect(set.isEmpty()).toBe(true);
      expect(set.isColumnReservedForRunId('run-1')).toBe(false);
    });
  });
});

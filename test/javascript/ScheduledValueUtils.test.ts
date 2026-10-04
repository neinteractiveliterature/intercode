import { DateTime } from 'luxon';
import { vi } from 'vitest';
import {
  findCurrentTimespan,
  findCurrentTimespanIndex,
  findCurrentValue,
  findTimespanAt,
  findTimespanIndexAt,
  findValueAt,
} from '../../app/javascript/ScheduledValueUtils';

describe('ScheduledValueUtils', () => {
  const scheduledValue = {
    timespans: [
      { start: null, finish: '2026-03-01T00:00:00Z', value: 'early bird' },
      { start: '2026-03-01T00:00:00Z', finish: '2026-06-01T00:00:00Z', value: 'regular' },
      { start: '2026-06-01T00:00:00Z', finish: null, value: 'late' },
    ],
  };

  describe('findTimespanIndexAt', () => {
    it('finds the timespan containing the time', () => {
      expect(findTimespanIndexAt(scheduledValue, DateTime.fromISO('2026-01-15T00:00:00Z'))).toBe(0);
      expect(findTimespanIndexAt(scheduledValue, DateTime.fromISO('2026-04-15T00:00:00Z'))).toBe(1);
      expect(findTimespanIndexAt(scheduledValue, DateTime.fromISO('2026-12-15T00:00:00Z'))).toBe(2);
    });

    it('is -1 when no timespan contains the time', () => {
      const gappy = { timespans: [{ start: '2026-03-01T00:00:00Z', finish: '2026-04-01T00:00:00Z', value: 'x' }] };

      expect(findTimespanIndexAt(gappy, DateTime.fromISO('2026-01-01T00:00:00Z'))).toBe(-1);
      expect(findTimespanIndexAt(gappy, DateTime.fromISO('2026-05-01T00:00:00Z'))).toBe(-1);
      expect(findTimespanIndexAt({ timespans: [] }, DateTime.fromISO('2026-05-01T00:00:00Z'))).toBe(-1);
    });

    it('treats a boundary as belonging to the later timespan', () => {
      expect(findTimespanIndexAt(scheduledValue, DateTime.fromISO('2026-03-01T00:00:00Z'))).toBe(1);
    });
  });

  describe('findTimespanAt and findValueAt', () => {
    it('return the timespan and its value, or undefined if there is none', () => {
      const time = DateTime.fromISO('2026-04-15T00:00:00Z');

      expect(findTimespanAt(scheduledValue, time)).toBe(scheduledValue.timespans[1]);
      expect(findValueAt(scheduledValue, time)).toBe('regular');

      const none = { timespans: [{ start: '2026-03-01T00:00:00Z', finish: '2026-04-01T00:00:00Z', value: 'x' }] };
      expect(findTimespanAt(none, DateTime.fromISO('2026-01-01T00:00:00Z'))).toBeUndefined();
      expect(findValueAt(none, DateTime.fromISO('2026-01-01T00:00:00Z'))).toBeUndefined();
    });
  });

  describe('current-time lookups', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('use the current time', () => {
      vi.setSystemTime(new Date('2026-04-15T00:00:00Z'));

      expect(findCurrentTimespanIndex(scheduledValue)).toBe(1);
      expect(findCurrentTimespan(scheduledValue)).toBe(scheduledValue.timespans[1]);
      expect(findCurrentValue(scheduledValue)).toBe('regular');
    });

    it('move on as time passes', () => {
      vi.setSystemTime(new Date('2026-07-01T00:00:00Z'));

      expect(findCurrentValue(scheduledValue)).toBe('late');
    });
  });
});

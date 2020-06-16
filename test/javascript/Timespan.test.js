import moment from 'moment-timezone';
import { DateTime } from 'luxon';
import Timespan from '../../app/javascript/Timespan';

describe('Timespan', () => {
  const defaultTimespan = new Timespan(
    DateTime.fromISO('2010-01-01T00:00:00Z'),
    DateTime.fromISO('2010-01-02T00:00:00Z'),
  );
  const infiniteTimespan = new Timespan(null, null);
  const beginningOfTime = defaultTimespan.clone();
  beginningOfTime.start = null;

  const endOfTime = defaultTimespan.clone();
  endOfTime.finish = null;

  it('checks that finish is after start', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Timespan(
        DateTime.fromISO('2010-01-02T00:00:00Z'),
        DateTime.fromISO('2010-01-01T00:00:00Z'),
      );
    }).toThrow('Start cannot be after finish');
  });

  it('constructs from strings', () => {
    const timespan = Timespan.fromStrings('2010-01-01T00:00:00Z', '2010-01-02T00:00:00Z');
    expect(+timespan.start).toEqual(+DateTime.fromISO('2010-01-01T00:00:00Z'));
    expect(+timespan.finish).toEqual(+DateTime.fromISO('2010-01-02T00:00:00Z'));
  });

  it('constructs from null strings', () => {
    const timespan = Timespan.fromStrings(null, null);
    expect(timespan.start).toBeNull();
    expect(timespan.finish).toBeNull();
  });

  describe('setZone', () => {
    it('converts time zone correctly', () => {
      const timespan = defaultTimespan.setZone('America/New_York');
      expect(timespan.start.hour).toEqual(19);
      expect(timespan.finish.hour).toEqual(19);
      expect(+timespan.start).toEqual(+DateTime.fromISO('2010-01-01T00:00:00Z'));
      expect(+timespan.finish).toEqual(+DateTime.fromISO('2010-01-02T00:00:00Z'));
    });

    it('handles nulls', () => {
      const timespan = infiniteTimespan.setZone('America/New_York');
      expect(timespan.start).toBeNull();
      expect(timespan.finish).toBeNull();
    });
  });

  describe('isFinite', () => {
    it('returns true if start and end are defined', () => {
      expect(defaultTimespan.isFinite()).toBeTruthy();
    });

    it('returns false if either or both field is null', () => {
      expect(beginningOfTime.isFinite()).toBeFalsy();
      expect(endOfTime.isFinite()).toBeFalsy();
      expect(infiniteTimespan.isFinite()).toBeFalsy();
    });
  });

  describe('includesTime', () => {
    it('includes the start but not the finish', () => {
      expect(defaultTimespan.includesTime(moment('2010-01-01T00:00:00Z'))).toBeTruthy();
      expect(defaultTimespan.includesTime(moment('2010-01-02T00:00:00Z'))).toBeFalsy();
    });

    it('includes times in the middle of the timespan', () => {
      expect(defaultTimespan.includesTime(moment('2010-01-01T08:00:00Z'))).toBeTruthy();
    });

    it('does not include times outside the timespan', () => {
      expect(defaultTimespan.includesTime(moment('2009-12-31T23:59:59Z'))).toBeFalsy();
      expect(defaultTimespan.includesTime(moment('2010-01-02T00:00:01Z'))).toBeFalsy();
    });

    it('handles open ends', () => {
      expect(beginningOfTime.includesTime(moment('1908-01-01T00:00:00Z'))).toBeTruthy();
      expect(endOfTime.includesTime(moment('2908-01-01T00:00:00Z'))).toBeTruthy();

      expect(endOfTime.includesTime(moment('1908-01-01T00:00:00Z'))).toBeFalsy();
      expect(beginningOfTime.includesTime(moment('2908-01-01T00:00:00Z'))).toBeFalsy();

      expect(infiniteTimespan.includesTime(moment('1908-01-01T00:00:00Z'))).toBeTruthy();
      expect(infiniteTimespan.includesTime(moment('2908-01-01T00:00:00Z'))).toBeTruthy();
    });
  });

  describe('includesTimespan', () => {
    it('includes a strict subset of itself', () => {
      const timespan = defaultTimespan.clone();
      timespan.start = timespan.start.plus(1, 'second');
      timespan.finish = timespan.finish.minus(1, 'second');

      expect(defaultTimespan.includesTimespan(timespan)).toBeTruthy();
    });

    it('includes itself', () => {
      expect(defaultTimespan.includesTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('does not include timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = slightlyBefore.start.minus(1, 'second');

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = slightlyAfter.finish.plus(1, 'second');

      expect(defaultTimespan.includesTimespan(slightlyBefore)).toBeFalsy();
      expect(defaultTimespan.includesTimespan(slightlyAfter)).toBeFalsy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = entirelyBefore.start.minus(1, 'day');
      entirelyBefore.finish = entirelyBefore.finish.minus(1, 'day');

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = entirelyAfter.start.plus(1, 'day');
      entirelyAfter.finish = entirelyAfter.finish.plus(1, 'day');

      expect(defaultTimespan.includesTimespan(entirelyBefore)).toBeFalsy();
      expect(defaultTimespan.includesTimespan(entirelyAfter)).toBeFalsy();
    });

    it('handles open ends', () => {
      expect(beginningOfTime.includesTimespan(defaultTimespan)).toBeTruthy();
      expect(endOfTime.includesTimespan(defaultTimespan)).toBeTruthy();
      expect(infiniteTimespan.includesTimespan(defaultTimespan)).toBeTruthy();

      expect(beginningOfTime.includesTimespan(endOfTime)).toBeFalsy();
      expect(endOfTime.includesTimespan(beginningOfTime)).toBeFalsy();
      expect(infiniteTimespan.includesTimespan(beginningOfTime)).toBeTruthy();
      expect(infiniteTimespan.includesTimespan(endOfTime)).toBeTruthy();
    });
  });

  describe('overlapsTimespan', () => {
    it('overlaps a strict subset of itself', () => {
      const timespan = defaultTimespan.clone();
      timespan.start = timespan.start.plus(1, 'second');
      timespan.finish = timespan.finish.minus(1, 'second');

      expect(defaultTimespan.overlapsTimespan(timespan)).toBeTruthy();
    });

    it('overlaps itself', () => {
      expect(defaultTimespan.overlapsTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('overlaps timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = slightlyBefore.start.minus(1, 'second');

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = slightlyAfter.finish.plus(1, 'second');

      expect(defaultTimespan.overlapsTimespan(slightlyBefore)).toBeTruthy();
      expect(defaultTimespan.overlapsTimespan(slightlyAfter)).toBeTruthy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = entirelyBefore.start.minus(1, 'day');
      entirelyBefore.finish = entirelyBefore.finish.minus(1, 'day');

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = entirelyAfter.start.plus(1, 'day');
      entirelyAfter.finish = entirelyAfter.finish.plus(1, 'day');

      expect(defaultTimespan.overlapsTimespan(entirelyBefore)).toBeFalsy();
      expect(defaultTimespan.overlapsTimespan(entirelyAfter)).toBeFalsy();
    });

    it('handles open ends', () => {
      expect(beginningOfTime.overlapsTimespan(defaultTimespan)).toBeTruthy();
      expect(endOfTime.overlapsTimespan(defaultTimespan)).toBeTruthy();
      expect(infiniteTimespan.overlapsTimespan(defaultTimespan)).toBeTruthy();

      expect(beginningOfTime.overlapsTimespan(endOfTime)).toBeTruthy();
      expect(endOfTime.overlapsTimespan(beginningOfTime)).toBeTruthy();
      expect(infiniteTimespan.overlapsTimespan(beginningOfTime)).toBeTruthy();
      expect(infiniteTimespan.overlapsTimespan(endOfTime)).toBeTruthy();
    });
  });

  describe('isSame', () => {
    it('works for all nullness cases', () => {
      [defaultTimespan, beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(timespan.isSame(timespan.clone())).toBeTruthy();
      });
    });

    it('correctly compares null to non-null', () => {
      expect(defaultTimespan.isSame(beginningOfTime)).toBeFalsy();
      expect(defaultTimespan.isSame(endOfTime)).toBeFalsy();
    });

    it('compares different times', () => {
      const differentStart = defaultTimespan.clone();
      differentStart.start = differentStart.start.minus(1, 'day');

      const differentFinish = defaultTimespan.clone();
      differentFinish.finish = differentFinish.finish.plus(1, 'day');

      expect(defaultTimespan.isSame(differentStart)).toBeFalsy();
      expect(defaultTimespan.isSame(differentFinish)).toBeFalsy();
    });
  });

  describe('intersection', () => {
    it('returns just the overlapping subset', () => {
      const somewhatLater = defaultTimespan.clone();
      somewhatLater.start = somewhatLater.start.plus(6, 'hours');
      somewhatLater.finish = somewhatLater.finish.plus(6, 'hours');

      const intersection = defaultTimespan.intersection(somewhatLater);
      const inverseIntersection = somewhatLater.intersection(defaultTimespan);
      expect(intersection.isSame(inverseIntersection)).toBeTruthy();
      expect(+intersection.start).toEqual(+somewhatLater.start);
      expect(+intersection.finish).toEqual(+defaultTimespan.finish);
    });

    it('returns null if there is no overlap', () => {
      const considerablyLater = defaultTimespan.clone();
      considerablyLater.start = considerablyLater.finish;
      considerablyLater.finish = considerablyLater.start.plus(24, 'hours');

      expect(defaultTimespan.intersection(considerablyLater)).toBeNull();
      expect(considerablyLater.intersection(defaultTimespan)).toBeNull();
    });

    it('handles open ends', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        const intersection = timespan.intersection(defaultTimespan);
        expect(intersection.isSame(defaultTimespan)).toBeTruthy();
      });

      expect(beginningOfTime.intersection(infiniteTimespan).isSame(beginningOfTime)).toBeTruthy();
      expect(endOfTime.intersection(infiniteTimespan).isSame(endOfTime)).toBeTruthy();
    });
  });

  describe('union', () => {
    it('returns the superset', () => {
      const somewhatLater = defaultTimespan.clone();
      somewhatLater.start = somewhatLater.start.plus(6, 'hours');
      somewhatLater.finish = somewhatLater.finish.plus(6, 'hours');

      const union = defaultTimespan.union(somewhatLater);
      const inverseUnion = somewhatLater.union(defaultTimespan);
      expect(union.isSame(inverseUnion)).toBeTruthy();
      expect(+union.start).toEqual(+defaultTimespan.start);
      expect(+union.finish).toEqual(+somewhatLater.finish);
    });

    it('handles open ends', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        const union = timespan.union(defaultTimespan);
        expect(union.isSame(timespan)).toBeTruthy();
      });

      expect(beginningOfTime.union(infiniteTimespan).isSame(infiniteTimespan)).toBeTruthy();
      expect(endOfTime.union(infiniteTimespan).isSame(infiniteTimespan)).toBeTruthy();
    });
  });

  describe('expandedToFit', () => {
    it('is an alias for union', () => {
      expect(defaultTimespan.expandedToFit).toBe(defaultTimespan.union);
    });
  });

  describe('getLength', () => {
    it('calculates length for finite timespans', () => {
      expect(defaultTimespan.getLength('hours')).toEqual(24);
    });

    it('returns null for infinite timespans', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(timespan.getLength('hours')).toBeNull();
      });
    });
  });

  describe('humanizeStartInTimezone', () => {
    it('formats the start time correctly for the given time zone', () => {
      expect(defaultTimespan.humanizeStartInTimezone('UTC', 'h:mma')).toEqual('12:00am');
      expect(defaultTimespan.humanizeStartInTimezone('America/New_York', 'h:mma')).toEqual('7:00pm');
    });

    it('handles open ends', () => {
      expect(beginningOfTime.humanizeStartInTimezone('UTC', 'h:mma')).toEqual('anytime');
    });
  });

  describe('humanizeFinishInTimezone', () => {
    it('formats the finish time correctly for the given time zone', () => {
      expect(defaultTimespan.humanizeFinishInTimezone('UTC', 'h:mma')).toEqual('12:00am');
      expect(defaultTimespan.humanizeFinishInTimezone('America/New_York', 'h:mma')).toEqual('7:00pm');
    });

    it('handles open ends', () => {
      expect(endOfTime.humanizeFinishInTimezone('UTC', 'h:mma')).toEqual('indefinitely');
    });
  });

  describe('humanizeInTimezone', () => {
    it('formats the times correctly for the given time zone', () => {
      expect(defaultTimespan.humanizeInTimezone('UTC', 'h:mma')).toEqual('12:00am');
      expect(defaultTimespan.humanizeInTimezone('America/New_York', 'h:mma')).toEqual('7:00pm');
    });

    it('handles open ends', () => {
      expect(beginningOfTime.humanizeInTimezone('UTC', 'h:mma')).toEqual('anytime - 12:00am');
      expect(endOfTime.humanizeInTimezone('UTC', 'h:mma')).toEqual('12:00am - indefinitely');
      expect(infiniteTimespan.humanizeInTimezone('UTC', 'h:mma')).toEqual('always');
    });
  });

  describe('getTimeHopsWithin', () => {
    it('errors on infinite timespans', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(() => timespan.getTimeHopsWithin('UTC', { unit: 'hour' })).toThrow('infinite');
      });
    });

    it('handles different units', () => {
      expect(defaultTimespan.getTimeHopsWithin('UTC', { unit: 'day' })).toHaveLength(1);
      expect(defaultTimespan.getTimeHopsWithin('UTC', { unit: 'hour' })).toHaveLength(24);
      expect(defaultTimespan.getTimeHopsWithin('UTC', { unit: 'minute' })).toHaveLength(24 * 60);
    });

    it('handles durations', () => {
      expect(defaultTimespan.getTimeHopsWithin('UTC', { unit: 'hour', duration: 2 })).toHaveLength(12);
    });

    it('returns moment objects with the correct time zone', () => {
      expect(defaultTimespan.getTimeHopsWithin('UTC', { unit: 'day' })[0].utcOffset()).toEqual(0);
      expect(defaultTimespan.getTimeHopsWithin('America/New_York', { unit: 'day' })[0].utcOffset()).toEqual(-5 * 60);
    });

    it('handles offset', () => {
      const hopsWithOffset = defaultTimespan.getTimeHopsWithin('UTC', { unit: 'hour', offset: moment.duration(2, 'hours') });
      expect(hopsWithOffset).toHaveLength(24);
      expect(hopsWithOffset[0].hour()).toEqual(2);
    });
  });

  describe('getTimespansWithin', () => {
    it('errors on infinite timespans', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(() => timespan.getTimespansWithin('UTC', { unit: 'hour' })).toThrow('infinite');
      });
    });

    it('handles different units', () => {
      expect(defaultTimespan.getTimespansWithin('UTC', { unit: 'day' })).toHaveLength(1);
      expect(defaultTimespan.getTimespansWithin('UTC', { unit: 'hour' })).toHaveLength(24);
      expect(defaultTimespan.getTimespansWithin('UTC', { unit: 'minute' })).toHaveLength(24 * 60);
    });

    it('handles durations', () => {
      expect(defaultTimespan.getTimespansWithin('UTC', { unit: 'hour', duration: 2 })).toHaveLength(12);
    });

    it('returns timespans with the correct time zone', () => {
      expect(defaultTimespan.getTimespansWithin('UTC', { unit: 'day' })[0].start.utcOffset()).toEqual(0);
      expect(defaultTimespan.getTimespansWithin('America/New_York', { unit: 'day' })[0].start.utcOffset()).toEqual(-5 * 60);
    });

    it('handles offset', () => {
      const hopsWithOffset = defaultTimespan.getTimespansWithin('UTC', { unit: 'hour', offset: moment.duration(2, 'hours') });
      expect(hopsWithOffset).toHaveLength(22);
      expect(hopsWithOffset[0].start.hour()).toEqual(2);
    });
  });

  describe('clone', () => {
    it('returns a new instance that isSame as the existing instance', () => {
      const cloned = defaultTimespan.clone();
      expect(cloned).not.toBe(defaultTimespan);
      expect(cloned.isSame(defaultTimespan)).toBeTruthy();
    });

    it('clones the members too', () => {
      const cloned = defaultTimespan.clone();
      expect(cloned.start).not.toBe(defaultTimespan.start);
      expect(cloned.finish).not.toBe(defaultTimespan.finish);
    });
  });
});

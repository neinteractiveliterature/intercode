import { isEqual, add, sub, parseISO } from 'date-fns';
import Timespan, { FiniteTimespan } from '../../app/javascript/Timespan';

describe('Timespan', () => {
  const defaultTimespan = Timespan.finiteFromDates(
    parseISO('2010-01-01T00:00:00Z'),
    parseISO('2010-01-02T00:00:00Z'),
    'Etc/UTC',
  );
  const infiniteTimespan = new Timespan(null, null, 'Etc/UTC');
  const beginningOfTime: Timespan = defaultTimespan.clone();
  beginningOfTime.start = null;

  const endOfTime: Timespan = defaultTimespan.clone();
  endOfTime.finish = null;

  it('checks that finish is after start', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Timespan(parseISO('2010-01-02T00:00:00Z'), parseISO('2010-01-01T00:00:00Z'), 'Etc/UTC');
    }).toThrow('Start cannot be after finish');
  });

  it('constructs from strings', () => {
    const timespan = Timespan.finiteFromStrings(
      '2010-01-01T00:00:00Z',
      '2010-01-02T00:00:00Z',
      'Etc/UTC',
    );
    expect(isEqual(timespan.start, parseISO('2010-01-01T00:00:00Z'))).toBeTruthy();
    expect(isEqual(timespan.finish, parseISO('2010-01-02T00:00:00Z'))).toBeTruthy();
  });

  it('constructs from null strings', () => {
    const timespan = Timespan.fromStrings(null, null, 'Etc/UTC');
    expect(timespan.start).toBeNull();
    expect(timespan.finish).toBeNull();
  });

  describe('tz', () => {
    it('converts time zone correctly', () => {
      const timespan = defaultTimespan.tz('America/New_York') as FiniteTimespan;
      expect(timespan.humanize()).toEqual('Thu 7:00pm - Fri 7:00pm');
      expect(isEqual(timespan.start, parseISO('2010-01-01T00:00:00Z'))).toBeTruthy();
      expect(isEqual(timespan.finish, parseISO('2010-01-02T00:00:00Z'))).toBeTruthy();
    });

    it('handles nulls', () => {
      const timespan = infiniteTimespan.tz('America/New_York');
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
      expect(defaultTimespan.includesTime(parseISO('2010-01-01T00:00:00Z'))).toBeTruthy();
      expect(defaultTimespan.includesTime(parseISO('2010-01-02T00:00:00Z'))).toBeFalsy();
    });

    it('includes times in the middle of the timespan', () => {
      expect(defaultTimespan.includesTime(parseISO('2010-01-01T08:00:00Z'))).toBeTruthy();
    });

    it('does not include times outside the timespan', () => {
      expect(defaultTimespan.includesTime(parseISO('2009-12-31T23:59:59Z'))).toBeFalsy();
      expect(defaultTimespan.includesTime(parseISO('2010-01-02T00:00:01Z'))).toBeFalsy();
    });

    it('handles open ends', () => {
      expect(beginningOfTime.includesTime(parseISO('1908-01-01T00:00:00Z'))).toBeTruthy();
      expect(endOfTime.includesTime(parseISO('2908-01-01T00:00:00Z'))).toBeTruthy();

      expect(endOfTime.includesTime(parseISO('1908-01-01T00:00:00Z'))).toBeFalsy();
      expect(beginningOfTime.includesTime(parseISO('2908-01-01T00:00:00Z'))).toBeFalsy();

      expect(infiniteTimespan.includesTime(parseISO('1908-01-01T00:00:00Z'))).toBeTruthy();
      expect(infiniteTimespan.includesTime(parseISO('2908-01-01T00:00:00Z'))).toBeTruthy();
    });
  });

  describe('includesTimespan', () => {
    it('includes a strict subset of itself', () => {
      const timespan = defaultTimespan.clone();
      timespan.start = add(timespan.start, { seconds: 1 });
      timespan.finish = sub(timespan.finish, { seconds: 1 });

      expect(defaultTimespan.includesTimespan(timespan)).toBeTruthy();
    });

    it('includes itself', () => {
      expect(defaultTimespan.includesTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('does not include timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = sub(slightlyBefore.start, { seconds: 1 });

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = add(slightlyAfter.finish, { seconds: 1 });

      expect(defaultTimespan.includesTimespan(slightlyBefore)).toBeFalsy();
      expect(defaultTimespan.includesTimespan(slightlyAfter)).toBeFalsy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = sub(entirelyBefore.start, { days: 1 });
      entirelyBefore.finish = sub(entirelyBefore.finish, { days: 1 });

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = add(entirelyAfter.start, { days: 1 });
      entirelyAfter.finish = add(entirelyAfter.finish, { days: 1 });

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
      timespan.start = add(timespan.start, { seconds: 1 });
      timespan.finish = sub(timespan.finish, { seconds: 1 });

      expect(defaultTimespan.overlapsTimespan(timespan)).toBeTruthy();
    });

    it('overlaps itself', () => {
      expect(defaultTimespan.overlapsTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('overlaps timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = sub(slightlyBefore.start, { seconds: 1 });

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = add(slightlyAfter.finish, { seconds: 1 });

      expect(defaultTimespan.overlapsTimespan(slightlyBefore)).toBeTruthy();
      expect(defaultTimespan.overlapsTimespan(slightlyAfter)).toBeTruthy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = sub(entirelyBefore.start, { days: 1 });
      entirelyBefore.finish = sub(entirelyBefore.finish, { days: 1 });

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = add(entirelyAfter.start, { days: 1 });
      entirelyAfter.finish = add(entirelyAfter.finish, { days: 1 });

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
      differentStart.start = sub(differentStart.start, { days: 1 });

      const differentFinish = defaultTimespan.clone();
      differentFinish.finish = add(differentFinish.finish, { days: 1 });

      expect(defaultTimespan.isSame(differentStart)).toBeFalsy();
      expect(defaultTimespan.isSame(differentFinish)).toBeFalsy();
    });
  });

  describe('intersection', () => {
    it('returns just the overlapping subset', () => {
      const somewhatLater = defaultTimespan.clone();
      somewhatLater.start = add(somewhatLater.start, { hours: 6 });
      somewhatLater.finish = add(somewhatLater.finish, { hours: 6 });

      const intersection = defaultTimespan.intersection(somewhatLater);
      const inverseIntersection = somewhatLater.intersection(defaultTimespan);
      expect(intersection.isSame(inverseIntersection)).toBeTruthy();
      expect(isEqual(intersection.start, somewhatLater.start)).toBeTruthy();
      expect(isEqual(intersection.finish, defaultTimespan.finish)).toBeTruthy();
    });

    it('returns null if there is no overlap', () => {
      const considerablyLater = defaultTimespan.clone();
      considerablyLater.start = considerablyLater.finish;
      considerablyLater.finish = add(considerablyLater.start, { hours: 24 });

      expect(defaultTimespan.intersection(considerablyLater)).toBeNull();
      expect(considerablyLater.intersection(defaultTimespan)).toBeNull();
    });

    it('handles open ends', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        const intersection = timespan.intersection(defaultTimespan);
        expect(intersection?.isSame(defaultTimespan)).toBeTruthy();
      });

      expect(beginningOfTime.intersection(infiniteTimespan)?.isSame(beginningOfTime)).toBeTruthy();
      expect(endOfTime.intersection(infiniteTimespan)?.isSame(endOfTime)).toBeTruthy();
    });
  });

  describe('union', () => {
    it('returns the superset', () => {
      const somewhatLater = defaultTimespan.clone();
      somewhatLater.start = add(somewhatLater.start, { hours: 6 });
      somewhatLater.finish = add(somewhatLater.finish, { hours: 6 });

      const union = defaultTimespan.union(somewhatLater);
      const inverseUnion = somewhatLater.union(defaultTimespan);
      expect(union.isSame(inverseUnion)).toBeTruthy();
      expect(isEqual(union.start, defaultTimespan.start)).toBeTruthy();
      expect(isEqual(union.finish, somewhatLater.finish)).toBeTruthy();
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

  describe('humanizeStart', () => {
    it('formats the start time correctly for the given time zone', () => {
      expect(defaultTimespan.humanizeStart('h:mmaaa')).toEqual('12:00am');
      expect(defaultTimespan.tz('America/New_York').humanizeStart('h:mmaaa')).toEqual('7:00pm');
    });

    it('handles open ends', () => {
      expect(beginningOfTime.humanizeStart('h:mmaaa')).toEqual('anytime');
    });
  });

  describe('humanizeFinish', () => {
    it('formats the finish time correctly for the given time zone', () => {
      expect(defaultTimespan.humanizeFinish('h:mmaaa')).toEqual('12:00am');
      expect(defaultTimespan.tz('America/New_York').humanizeFinish('h:mmaaa')).toEqual('7:00pm');
    });

    it('handles open ends', () => {
      expect(endOfTime.humanizeFinish('h:mmaaa')).toEqual('indefinitely');
    });
  });

  describe('humanize', () => {
    it('formats the times correctly for the given time zone', () => {
      expect(defaultTimespan.humanize('h:mmaaa')).toEqual('12:00am');
      expect(defaultTimespan.tz('America/New_York').humanize('h:mmaaa')).toEqual('7:00pm');
    });

    it('handles open ends', () => {
      expect(beginningOfTime.humanize('h:mmaaa')).toEqual('anytime - 12:00am');
      expect(endOfTime.humanize('h:mmaaa')).toEqual('12:00am - indefinitely');
      expect(infiniteTimespan.humanize('h:mmaaa')).toEqual('always');
    });
  });

  describe('getTimeHopsWithin', () => {
    it('errors on infinite timespans', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(() => timespan.getTimeHopsWithin({ unit: 'hours' })).toThrow('infinite');
      });
    });

    it('handles different units', () => {
      expect(defaultTimespan.getTimeHopsWithin({ unit: 'days' })).toHaveLength(1);
      expect(defaultTimespan.getTimeHopsWithin({ unit: 'hours' })).toHaveLength(24);
      expect(defaultTimespan.getTimeHopsWithin({ unit: 'minutes' })).toHaveLength(24 * 60);
    });

    it('handles durations', () => {
      expect(defaultTimespan.getTimeHopsWithin({ unit: 'hours', step: 2 })).toHaveLength(12);
    });

    it('returns dates with the correct time zone', () => {
      expect(defaultTimespan.getTimeHopsWithin({ unit: 'days' })[0].getUTCHours()).toEqual(0);
      expect(
        defaultTimespan.tz('America/New_York').getTimeHopsWithin({ unit: 'days' })[0].getUTCHours(),
      ).toEqual(5);
    });

    it('handles offset', () => {
      const hopsWithOffset = defaultTimespan.getTimeHopsWithin({
        unit: 'hours',
        offset: { hours: 2 },
      });
      expect(hopsWithOffset).toHaveLength(24);
      expect(hopsWithOffset[0].getUTCHours()).toEqual(2);
    });
  });

  describe('getTimespansWithin', () => {
    it('errors on infinite timespans', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(() => timespan.getTimespansWithin({ unit: 'hours' })).toThrow('infinite');
      });
    });

    it('handles different units', () => {
      expect(defaultTimespan.getTimespansWithin({ unit: 'days' })).toHaveLength(1);
      expect(defaultTimespan.getTimespansWithin({ unit: 'hours' })).toHaveLength(24);
      expect(defaultTimespan.getTimespansWithin({ unit: 'minutes' })).toHaveLength(24 * 60);
    });

    it('handles durations', () => {
      expect(defaultTimespan.getTimespansWithin({ unit: 'hours', step: 2 })).toHaveLength(12);
    });

    it('returns timespans with the correct time zone', () => {
      const utcSpans = defaultTimespan.getTimespansWithin({ unit: 'days' });
      const nySpans = defaultTimespan.tz('America/New_York').getTimespansWithin({ unit: 'days' });
      expect(utcSpans[0].start.getUTCHours()).toEqual(0);
      // doesn't actually change the absolute times, but does change how the time breaks up
      expect(nySpans[0].start.getUTCHours()).toEqual(0);
      expect(nySpans[1].start.getUTCHours()).toEqual(5);
    });

    it('handles offset', () => {
      const spansWithOffset = defaultTimespan.getTimespansWithin({
        unit: 'hours',
        offset: { hours: 2 },
      });
      expect(spansWithOffset).toHaveLength(22);
      expect(spansWithOffset[0].start.getUTCHours()).toEqual(2);
    });
  });

  describe('clone', () => {
    it('returns a new instance that isSame as the existing instance', () => {
      const cloned = defaultTimespan.clone();
      expect(cloned).not.toBe(defaultTimespan);
      expect(cloned.isSame(defaultTimespan)).toBeTruthy();
    });
  });
});

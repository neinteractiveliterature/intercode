import { DateTime, Duration } from 'luxon';
import getI18n from '../../app/javascript/setupI18Next';
import Timespan from '../../app/javascript/Timespan';

describe('Timespan', () => {
  const defaultTimespan = Timespan.finiteFromDateTimes(
    DateTime.fromISO('2010-01-01T00:00:00Z'),
    DateTime.fromISO('2010-01-02T00:00:00Z'),
  );
  const infiniteTimespan = new Timespan(null, null);
  const beginningOfTime: Timespan = defaultTimespan.clone();
  beginningOfTime.start = null;

  const endOfTime: Timespan = defaultTimespan.clone();
  endOfTime.finish = null;

  it('checks that finish is after start', () => {
    expect(() => {
      new Timespan(DateTime.fromISO('2010-01-02T00:00:00Z'), DateTime.fromISO('2010-01-01T00:00:00Z'));
    }).toThrow('Start cannot be after finish');
  });

  it('constructs from strings', () => {
    const timespan = Timespan.finiteFromStrings('2010-01-01T00:00:00Z', '2010-01-02T00:00:00Z');
    expect(timespan.start.equals(DateTime.fromISO('2010-01-01T00:00:00Z'))).toBeTruthy();
    expect(timespan.finish.equals(DateTime.fromISO('2010-01-02T00:00:00Z'))).toBeTruthy();
  });

  it('constructs from null strings', () => {
    const timespan = Timespan.fromStrings(null, null);
    expect(timespan.start).toBeNull();
    expect(timespan.finish).toBeNull();
  });

  describe('tz', () => {
    it('converts time zone correctly', () => {
      const timespan = defaultTimespan.tz('America/New_York');
      expect(timespan.start.hour).toEqual(19);
      expect(timespan.finish.hour).toEqual(19);
      expect(timespan.start.toMillis()).toEqual(DateTime.fromISO('2010-01-01T00:00:00Z').toMillis());
      expect(timespan.finish.toMillis()).toEqual(DateTime.fromISO('2010-01-02T00:00:00Z').toMillis());
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
      expect(defaultTimespan.includesTime(DateTime.fromISO('2010-01-01T00:00:00Z'))).toBeTruthy();
      expect(defaultTimespan.includesTime(DateTime.fromISO('2010-01-02T00:00:00Z'))).toBeFalsy();
    });

    it('includes times in the middle of the timespan', () => {
      expect(defaultTimespan.includesTime(DateTime.fromISO('2010-01-01T08:00:00Z'))).toBeTruthy();
    });

    it('does not include times outside the timespan', () => {
      expect(defaultTimespan.includesTime(DateTime.fromISO('2009-12-31T23:59:59Z'))).toBeFalsy();
      expect(defaultTimespan.includesTime(DateTime.fromISO('2010-01-02T00:00:01Z'))).toBeFalsy();
    });

    it('handles open ends', () => {
      expect(beginningOfTime.includesTime(DateTime.fromISO('1908-01-01T00:00:00Z'))).toBeTruthy();
      expect(endOfTime.includesTime(DateTime.fromISO('2908-01-01T00:00:00Z'))).toBeTruthy();

      expect(endOfTime.includesTime(DateTime.fromISO('1908-01-01T00:00:00Z'))).toBeFalsy();
      expect(beginningOfTime.includesTime(DateTime.fromISO('2908-01-01T00:00:00Z'))).toBeFalsy();

      expect(infiniteTimespan.includesTime(DateTime.fromISO('1908-01-01T00:00:00Z'))).toBeTruthy();
      expect(infiniteTimespan.includesTime(DateTime.fromISO('2908-01-01T00:00:00Z'))).toBeTruthy();
    });
  });

  describe('includesTimespan', () => {
    it('includes a strict subset of itself', () => {
      const timespan = defaultTimespan.clone();
      timespan.start = timespan.start.plus({ seconds: 1 });
      timespan.finish = timespan.finish.minus({ seconds: 1 });

      expect(defaultTimespan.includesTimespan(timespan)).toBeTruthy();
    });

    it('includes itself', () => {
      expect(defaultTimespan.includesTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('does not include timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = slightlyBefore.start.minus({ seconds: 1 });

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = slightlyAfter.finish.plus({ seconds: 1 });

      expect(defaultTimespan.includesTimespan(slightlyBefore)).toBeFalsy();
      expect(defaultTimespan.includesTimespan(slightlyAfter)).toBeFalsy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = entirelyBefore.start.minus({ days: 1 });
      entirelyBefore.finish = entirelyBefore.finish.minus({ days: 1 });

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = entirelyAfter.start.plus({ days: 1 });
      entirelyAfter.finish = entirelyAfter.finish.plus({ days: 1 });

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
      timespan.start = timespan.start.plus({ seconds: 1 });
      timespan.finish = timespan.finish.minus({ seconds: 1 });

      expect(defaultTimespan.overlapsTimespan(timespan)).toBeTruthy();
    });

    it('overlaps itself', () => {
      expect(defaultTimespan.overlapsTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('overlaps timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = slightlyBefore.start.minus({ seconds: 1 });

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = slightlyAfter.finish.plus({ seconds: 1 });

      expect(defaultTimespan.overlapsTimespan(slightlyBefore)).toBeTruthy();
      expect(defaultTimespan.overlapsTimespan(slightlyAfter)).toBeTruthy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = entirelyBefore.start.minus({ days: 1 });
      entirelyBefore.finish = entirelyBefore.finish.minus({ days: 1 });

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = entirelyAfter.start.plus({ days: 1 });
      entirelyAfter.finish = entirelyAfter.finish.plus({ days: 1 });

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
      differentStart.start = differentStart.start.minus({ days: 1 });

      const differentFinish = defaultTimespan.clone();
      differentFinish.finish = differentFinish.finish.plus({ days: 1 });

      expect(defaultTimespan.isSame(differentStart)).toBeFalsy();
      expect(defaultTimespan.isSame(differentFinish)).toBeFalsy();
    });
  });

  describe('intersection', () => {
    it('returns just the overlapping subset', () => {
      const somewhatLater = defaultTimespan.clone();
      somewhatLater.start = somewhatLater.start.plus({ hours: 6 });
      somewhatLater.finish = somewhatLater.finish.plus({ hours: 6 });

      const intersection = defaultTimespan.intersection(somewhatLater);
      const inverseIntersection = somewhatLater.intersection(defaultTimespan);
      expect(intersection.isSame(inverseIntersection)).toBeTruthy();
      expect(intersection.start.equals(somewhatLater.start)).toBeTruthy();
      expect(intersection.finish.equals(defaultTimespan.finish)).toBeTruthy();
    });

    it('returns null if there is no overlap', () => {
      const considerablyLater = defaultTimespan.clone();
      considerablyLater.start = considerablyLater.finish;
      considerablyLater.finish = considerablyLater.start.plus({ hours: 24 });

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
      somewhatLater.start = somewhatLater.start.plus({ hours: 6 });
      somewhatLater.finish = somewhatLater.finish.plus({ hours: 6 });

      const union = defaultTimespan.union(somewhatLater);
      const inverseUnion = somewhatLater.union(defaultTimespan);
      expect(union.isSame(inverseUnion)).toBeTruthy();
      expect(union.start.equals(defaultTimespan.start)).toBeTruthy();
      expect(union.finish.equals(somewhatLater.finish)).toBeTruthy();
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
      expect(defaultTimespan.getLength('hours').hours).toEqual(24);
    });

    it('returns null for infinite timespans', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(timespan.getLength('hours')).toBeNull();
      });
    });
  });

  describe('humanizeStartInTimezone', () => {
    it('formats the start time correctly for the given time zone', async () => {
      expect(defaultTimespan.humanizeStartInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        '12:00am',
      );
      expect(
        defaultTimespan.humanizeStartInTimezone('America/New_York', (await getI18n()).getFixedT('en'), 'shortTime'),
      ).toEqual('7:00pm');
    });

    it('handles open ends', async () => {
      expect(beginningOfTime.humanizeStartInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        'anytime',
      );
    });
  });

  describe('humanizeFinishInTimezone', () => {
    it('formats the finish time correctly for the given time zone', async () => {
      expect(defaultTimespan.humanizeFinishInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        '12:00am',
      );
      expect(
        defaultTimespan.humanizeFinishInTimezone('America/New_York', (await getI18n()).getFixedT('en'), 'shortTime'),
      ).toEqual('7:00pm');
    });

    it('handles open ends', async () => {
      expect(endOfTime.humanizeFinishInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        'indefinitely',
      );
    });
  });

  describe('humanizeInTimezone', () => {
    it('formats the times correctly for the given time zone', async () => {
      expect(defaultTimespan.humanizeInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        '12:00am',
      );
      expect(
        defaultTimespan.humanizeInTimezone('America/New_York', (await getI18n()).getFixedT('en'), 'shortTime'),
      ).toEqual('7:00pm');
    });

    it('handles open ends', async () => {
      expect(beginningOfTime.humanizeInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        'anytime - 12:00am',
      );
      expect(endOfTime.humanizeInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        '12:00am - indefinitely',
      );
      expect(infiniteTimespan.humanizeInTimezone('UTC', (await getI18n()).getFixedT('en'), 'shortTime')).toEqual(
        'always',
      );
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

    it('returns DateTime.fromISO objects with the correct time zone', () => {
      expect(defaultTimespan.getTimeHopsWithin('UTC', { unit: 'day' })[0].offset).toEqual(0);
      expect(defaultTimespan.getTimeHopsWithin('America/New_York', { unit: 'day' })[0].offset).toEqual(-5 * 60);
    });

    it('handles offset', () => {
      const hopsWithOffset = defaultTimespan.getTimeHopsWithin('UTC', {
        unit: 'hour',
        offset: Duration.fromObject({ hours: 2 }),
      });
      expect(hopsWithOffset).toHaveLength(24);
      expect(hopsWithOffset[0].hour).toEqual(2);
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
      expect(defaultTimespan.getTimespansWithin('UTC', { unit: 'day' })[0].start.offset).toEqual(0);
      expect(defaultTimespan.getTimespansWithin('America/New_York', { unit: 'day' })[0].start.offset).toEqual(-5 * 60);
    });

    it('handles offset', () => {
      const spansWithOffset = defaultTimespan.getTimespansWithin('UTC', {
        unit: 'hour',
        offset: Duration.fromObject({ hours: 2 }),
      });
      expect(spansWithOffset).toHaveLength(22);
      // first span gets expanded to cover the beginning of the timespan before the offset starts
      expect(spansWithOffset[0].start.hour).toEqual(0);
      // second span should start 1 unit*duration after the offset
      expect(spansWithOffset[1].start.hour).toEqual(3);
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

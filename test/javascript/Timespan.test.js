import moment from 'moment-timezone';
import Timespan from '../../app/javascript/Timespan';

describe('Timespan', () => {
  const defaultTimespan = new Timespan(moment('2010-01-01T00:00:00Z'), moment('2010-01-02T00:00:00Z'));
  const infiniteTimespan = new Timespan(null, null);
  const beginningOfTime = defaultTimespan.clone();
  beginningOfTime.start = null;

  const endOfTime = defaultTimespan.clone();
  endOfTime.finish = null;

  it('checks that finish is after start', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Timespan(
        moment('2010-01-02T00:00:00Z'),
        moment('2010-01-01T00:00:00Z'),
      );
    }).toThrow('Start cannot be after finish');
  });

  it('constructs from strings', () => {
    const timespan = Timespan.fromStrings('2010-01-01T00:00:00Z', '2010-01-02T00:00:00Z');
    expect(timespan.start.isSame('2010-01-01T00:00:00Z')).toBeTruthy();
    expect(timespan.finish.isSame('2010-01-02T00:00:00Z')).toBeTruthy();
  });

  it('constructs from null strings', () => {
    const timespan = Timespan.fromStrings(null, null);
    expect(timespan.start).toBeNull();
    expect(timespan.finish).toBeNull();
  });

  describe('tz', () => {
    it('converts time zone correctly', () => {
      const timespan = defaultTimespan.tz('US/Eastern');
      expect(timespan.start.hour()).toEqual(19);
      expect(timespan.finish.hour()).toEqual(19);
      expect(timespan.start.isSame('2010-01-01T00:00:00Z')).toBeTruthy();
      expect(timespan.finish.isSame('2010-01-02T00:00:00Z')).toBeTruthy();
    });

    it('handles nulls', () => {
      const timespan = infiniteTimespan.tz('US/Eastern');
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
      timespan.start = moment(timespan.start).add(1, 'second');
      timespan.finish = moment(timespan.finish).subtract(1, 'second');

      expect(defaultTimespan.includesTimespan(timespan)).toBeTruthy();
    });

    it('includes itself', () => {
      expect(defaultTimespan.includesTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('does not include timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = moment(slightlyBefore.start).subtract(1, 'second');

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = moment(slightlyAfter.finish).add(1, 'second');

      expect(defaultTimespan.includesTimespan(slightlyBefore)).toBeFalsy();
      expect(defaultTimespan.includesTimespan(slightlyAfter)).toBeFalsy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = moment(entirelyBefore.start).subtract(1, 'day');
      entirelyBefore.finish = moment(entirelyBefore.finish).subtract(1, 'day');

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = moment(entirelyAfter.start).add(1, 'day');
      entirelyAfter.finish = moment(entirelyAfter.finish).add(1, 'day');

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
      timespan.start = moment(timespan.start).add(1, 'second');
      timespan.finish = moment(timespan.finish).subtract(1, 'second');

      expect(defaultTimespan.overlapsTimespan(timespan)).toBeTruthy();
    });

    it('overlaps itself', () => {
      expect(defaultTimespan.overlapsTimespan(defaultTimespan.clone())).toBeTruthy();
    });

    it('overlaps timespans that have parts outside itself', () => {
      const slightlyBefore = defaultTimespan.clone();
      slightlyBefore.start = moment(slightlyBefore.start).subtract(1, 'second');

      const slightlyAfter = defaultTimespan.clone();
      slightlyAfter.finish = moment(slightlyAfter.finish).add(1, 'second');

      expect(defaultTimespan.overlapsTimespan(slightlyBefore)).toBeTruthy();
      expect(defaultTimespan.overlapsTimespan(slightlyAfter)).toBeTruthy();
    });

    it('does not overlap timespans that are entirely outside itself', () => {
      const entirelyBefore = defaultTimespan.clone();
      entirelyBefore.start = moment(entirelyBefore.start).subtract(1, 'day');
      entirelyBefore.finish = moment(entirelyBefore.finish).subtract(1, 'day');

      const entirelyAfter = defaultTimespan.clone();
      entirelyAfter.start = moment(entirelyAfter.start).add(1, 'day');
      entirelyAfter.finish = moment(entirelyAfter.finish).add(1, 'day');

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
      differentStart.start = moment(differentStart.start).subtract(1, 'day');

      const differentFinish = defaultTimespan.clone();
      differentFinish.finish = moment(differentFinish.finish).add(1, 'day');

      expect(defaultTimespan.isSame(differentStart)).toBeFalsy();
      expect(defaultTimespan.isSame(differentFinish)).toBeFalsy();
    });
  });

  describe('intersection', () => {
    it('returns just the overlapping subset', () => {
      const somewhatLater = defaultTimespan.clone();
      somewhatLater.start = moment(somewhatLater.start).add(6, 'hours');
      somewhatLater.finish = moment(somewhatLater.finish).add(6, 'hours');

      const intersection = defaultTimespan.intersection(somewhatLater);
      const inverseIntersection = somewhatLater.intersection(defaultTimespan);
      expect(intersection.isSame(inverseIntersection)).toBeTruthy();
      expect(intersection.start.isSame(somewhatLater.start)).toBeTruthy();
      expect(intersection.finish.isSame(defaultTimespan.finish)).toBeTruthy();
    });

    it('returns null if there is no overlap', () => {
      const considerablyLater = defaultTimespan.clone();
      considerablyLater.start = moment(considerablyLater.finish);
      considerablyLater.finish = moment(considerablyLater.start).add(24, 'hours');

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
      somewhatLater.start = moment(somewhatLater.start).add(6, 'hours');
      somewhatLater.finish = moment(somewhatLater.finish).add(6, 'hours');

      const union = defaultTimespan.union(somewhatLater);
      const inverseUnion = somewhatLater.union(defaultTimespan);
      expect(union.isSame(inverseUnion)).toBeTruthy();
      expect(union.start.isSame(defaultTimespan.start)).toBeTruthy();
      expect(union.finish.isSame(somewhatLater.finish)).toBeTruthy();
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
        expect(() => timespan.getTimeHopsWithin('UTC', 'hour', 0)).toThrow('infinite');
      });
    });

    it('handles different units', () => {
      expect(defaultTimespan.getTimeHopsWithin('UTC', 'day', 0)).toHaveLength(1);
      expect(defaultTimespan.getTimeHopsWithin('UTC', 'hour', 0)).toHaveLength(24);
      expect(defaultTimespan.getTimeHopsWithin('UTC', 'minute', 0)).toHaveLength(24 * 60);
    });

    it('returns moment objects with the correct time zone', () => {
      expect(defaultTimespan.getTimeHopsWithin('UTC', 'day', 0)[0].utcOffset()).toEqual(0);
      expect(defaultTimespan.getTimeHopsWithin('America/New_York', 'day', 0)[0].utcOffset()).toEqual(-5 * 60);
    });

    it('handles offset', () => {
      const hopsWithOffset = defaultTimespan.getTimeHopsWithin('UTC', 'hour', moment.duration(2, 'hours'));
      expect(hopsWithOffset).toHaveLength(24);
      expect(hopsWithOffset[0].hour()).toEqual(2);
    });
  });

  describe('getTimespansWithin', () => {
    it('errors on infinite timespans', () => {
      [beginningOfTime, endOfTime, infiniteTimespan].forEach((timespan) => {
        expect(() => timespan.getTimespansWithin('UTC', 'hour', 0)).toThrow('infinite');
      });
    });

    it('handles different units', () => {
      expect(defaultTimespan.getTimespansWithin('UTC', 'day', 0)).toHaveLength(1);
      expect(defaultTimespan.getTimespansWithin('UTC', 'hour', 0)).toHaveLength(24);
      expect(defaultTimespan.getTimespansWithin('UTC', 'minute', 0)).toHaveLength(24 * 60);
    });

    it('returns timespans with the correct time zone', () => {
      expect(defaultTimespan.getTimespansWithin('UTC', 'day', 0)[0].start.utcOffset()).toEqual(0);
      expect(defaultTimespan.getTimespansWithin('America/New_York', 'day', 0)[0].start.utcOffset()).toEqual(-5 * 60);
    });

    it('handles offset', () => {
      const hopsWithOffset = defaultTimespan.getTimespansWithin('UTC', 'hour', moment.duration(2, 'hours'));
      expect(hopsWithOffset).toHaveLength(24);
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

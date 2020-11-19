import * as TimespanUtils from '../../app/javascript/TimespanUtils';
import { TimezoneMode } from '../../app/javascript/graphqlTypes.generated';
import { getUserTimezoneName, setUserTimezoneName } from '../../app/javascript/TimeUtils';

describe('timespanFromRun', () => {
  test('staying in the same time zone', () => {
    const timespan = TimespanUtils.timespanFromRun(
      'Etc/UTC',
      { length_seconds: 3600 },
      { starts_at: '2017-01-01T09:00:00.000Z' },
    );

    expect(timespan.start.getUTCHours()).toEqual(9);
    expect(timespan.finish.getUTCHours()).toEqual(10);
  });

  test('converting to a different time zone', () => {
    const timespan = TimespanUtils.timespanFromRun(
      'America/New_York',
      { length_seconds: 3600 },
      { starts_at: '2017-01-01T09:00:00.000Z' },
    );

    // start and finish are still in UTC
    expect(timespan.start?.getUTCHours()).toEqual(9);
    expect(timespan.finish?.getUTCHours()).toEqual(10);

    expect(timespan.humanize()).toEqual('Sun 4:00am - 5:00am');
  });
});

describe('user_local timezone mode', () => {
  let originalDefaultZoneName: string;

  beforeEach(() => {
    originalDefaultZoneName = getUserTimezoneName();
    setUserTimezoneName('America/Chicago');
  });
  afterEach(() => {
    setUserTimezoneName(originalDefaultZoneName);
  });

  test('timespanFromConvention converts to timezone correctly', () => {
    const timespan = TimespanUtils.timespanFromConvention({
      starts_at: '2017-01-01T09:00:00.000Z',
      ends_at: '2017-01-02T18:00:00.000Z',
      timezone_mode: TimezoneMode.UserLocal,
    });

    // start and finish are still in UTC
    expect(timespan.start?.getUTCHours()).toEqual(9);
    expect(timespan.finish?.getUTCHours()).toEqual(18);

    expect(timespan.humanize()).toEqual('Sun 3:00am - Mon noon');
  });
});

describe('convention_local timezone mode', () => {
  test('timespanFromConvention converts to timezone correctly', () => {
    const timespan = TimespanUtils.timespanFromConvention({
      starts_at: '2017-01-01T09:00:00.000Z',
      ends_at: '2017-01-02T18:00:00.000Z',
      timezone_name: 'America/New_York',
      timezone_mode: TimezoneMode.ConventionLocal,
    });

    // start and finish are still in UTC
    expect(timespan.start?.getUTCHours()).toEqual(9);
    expect(timespan.finish?.getUTCHours()).toEqual(18);

    expect(timespan.humanize()).toEqual('Sun 4:00am - Mon 1:00pm');
  });
});

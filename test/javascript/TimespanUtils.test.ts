import { Settings, Zone } from 'luxon';
import * as TimespanUtils from '../../app/javascript/TimespanUtils';
import { TimezoneMode } from '../../app/javascript/graphqlTypes.generated';

describe('timespanFromRun', () => {
  test('staying in the same time zone', () => {
    const timespan = TimespanUtils.timespanFromRun(
      'Etc/UTC',
      { length_seconds: 3600 },
      { starts_at: '2017-01-01T09:00:00.000Z' },
    );

    expect(timespan.start.hour).toEqual(9);
    expect(timespan.finish.hour).toEqual(10);
  });

  test('converting to a different time zone', () => {
    const timespan = TimespanUtils.timespanFromRun(
      'America/New_York',
      { length_seconds: 3600 },
      { starts_at: '2017-01-01T09:00:00.000Z' },
    );

    expect(timespan.start.hour).toEqual(4);
    expect(timespan.finish.hour).toEqual(5);
  });
});

describe('user_local timezone mode', () => {
  let originalDefaultZone: string | Zone;

  beforeEach(() => {
    originalDefaultZone = Settings.defaultZone;
    Settings.defaultZone = 'America/Chicago';
  });
  afterEach(() => {
    Settings.defaultZone = originalDefaultZone;
  });

  test('timespanFromConvention converts to timezone correctly', () => {
    const timespan = TimespanUtils.timespanFromConvention({
      starts_at: '2017-01-01T09:00:00.000Z',
      ends_at: '2017-01-02T18:00:00.000Z',
      timezone_mode: TimezoneMode.UserLocal,
    });

    expect(timespan.start?.hour).toEqual(3);
    expect(timespan.finish?.hour).toEqual(12);
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

    expect(timespan.start?.hour).toEqual(4);
    expect(timespan.finish?.hour).toEqual(13);
  });
});

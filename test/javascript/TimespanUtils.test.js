import { Settings } from 'luxon';
import * as TimespanUtils from '../../app/javascript/TimespanUtils';

describe('user_local timezone mode', () => {
  let originalDefaultZoneName;

  beforeEach(() => {
    originalDefaultZoneName = Settings.defaultZoneName;
    Settings.defaultZoneName = 'America/Chicago';
  });
  afterEach(() => { Settings.defaultZoneName = originalDefaultZoneName; });

  test('timespanFromConvention converts to timezone correctly', () => {
    const timespan = TimespanUtils.timespanFromConvention({
      starts_at: '2017-01-01T09:00:00.000Z',
      ends_at: '2017-01-02T18:00:00.000Z',
      timezone_mode: 'user_local',
    });

    expect(timespan.start.hour).toEqual(3);
    expect(timespan.finish.hour).toEqual(12);
  });

  test('timespanFromRun figures out the end time correctly', () => {
    const timespan = TimespanUtils.timespanFromRun(
      { timezone_mode: 'user_local' },
      { length_seconds: 3600 },
      { starts_at: '2017-01-01T09:00:00.000Z' },
    );

    expect(timespan.start.hour).toEqual(3);
    expect(timespan.finish.hour).toEqual(4);
  });
});

describe('convention_local timezone mode', () => {
  test('timespanFromConvention converts to timezone correctly', () => {
    const timespan = TimespanUtils.timespanFromConvention({
      starts_at: '2017-01-01T09:00:00.000Z',
      ends_at: '2017-01-02T18:00:00.000Z',
      timezone_name: 'America/New_York',
      timezone_mode: 'convention_local',
    });

    expect(timespan.start.hour).toEqual(4);
    expect(timespan.finish.hour).toEqual(13);
  });

  test('timespanFromRun figures out the end time correctly', () => {
    const timespan = TimespanUtils.timespanFromRun(
      { timezone_name: 'America/New_York', timezone_mode: 'convention_local' },
      { length_seconds: 3600 },
      { starts_at: '2017-01-01T09:00:00.000Z' },
    );

    expect(timespan.start.hour).toEqual(4);
    expect(timespan.finish.hour).toEqual(5);
  });
});

import * as TimespanUtils from '../../app/javascript/TimespanUtils';

test('timespanFromConvention converts to timezone correctly', () => {
  const timespan = TimespanUtils.timespanFromConvention({
    starts_at: '2017-01-01T09:00:00.000Z',
    ends_at: '2017-01-02T18:00:00.000Z',
    timezone_name: 'US/Eastern',
  });

  expect(timespan.start.hour()).toEqual(4);
  expect(timespan.finish.hour()).toEqual(13);
});

test('timespanFromRun figures out the end time correctly', () => {
  const timespan = TimespanUtils.timespanFromRun(
    { timezone_name: 'US/Eastern' },
    { length_seconds: 3600 },
    { starts_at: '2017-01-01T09:00:00.000Z' },
  );

  expect(timespan.start.hour()).toEqual(4);
  expect(timespan.finish.hour()).toEqual(5);
});

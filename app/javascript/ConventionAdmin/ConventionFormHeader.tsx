import React, { useMemo } from 'react';
import { assertNever } from 'assert-never';

import { DateTime } from 'luxon';
import { findCurrentValue } from '../ScheduledValueUtils';
import { MAXIMUM_EVENT_SIGNUPS_OPTIONS } from './ConventionFormEventsSection';
import pluralizeWithCount from '../pluralizeWithCount';
import { timezoneNameForConvention } from '../TimeUtils';
import { ShowSchedule, ScheduledValue, Convention } from '../graphqlTypes.generated';

function describeEventVisibility(visibility: ShowSchedule) {
  switch (visibility) {
    case ShowSchedule.No: return 'Hidden';
    case ShowSchedule.Priv: return 'Staff only';
    case ShowSchedule.Gms: return 'Staff and event teams';
    case ShowSchedule.Yes: return 'Public';
    default: return assertNever(visibility);
  }
}

function describeMaximumEventSignups(scheduledValue: ScheduledValue) {
  const currentValue = findCurrentValue(scheduledValue);

  if (!currentValue) {
    return 'No signups yet';
  }

  const currentOption = MAXIMUM_EVENT_SIGNUPS_OPTIONS
    .find(([option]) => currentValue === option);
  if (!currentOption) {
    return currentValue;
  }

  return currentOption[1];
}

function describeConventionTiming(
  startsAt: string, endsAt: string, timezoneName: string, canceled: boolean,
) {
  if (canceled) {
    return 'is canceled';
  }

  const now = DateTime.local().setZone(timezoneName).startOf('day');
  const conventionStart = DateTime.fromISO(startsAt).setZone(timezoneName).startOf('day');
  const conventionEnd = DateTime.fromISO(endsAt).setZone(timezoneName).startOf('day');

  if (now < conventionStart) {
    return `starts in ${pluralizeWithCount('day', conventionStart.diff(now, 'day'))}`;
  }

  if (now < conventionEnd) {
    return `ends in ${pluralizeWithCount('day', conventionEnd.diff(now, 'day'))}`;
  }

  if (conventionEnd < now) {
    return `ended ${pluralizeWithCount('day', now.diff(conventionEnd, 'day'))} ago`;
  }

  const isMultiDay = conventionStart < conventionEnd;
  return `${isMultiDay ? 'ends' : 'is'} today`;
}

export type ConventionFormHeaderProps = {
  convention: Pick<Convention,
  'starts_at' | 'ends_at' | 'canceled' | 'timezone_name' | 'timezone_mode' |
  'maximum_event_signups' | 'site_mode' | 'show_event_list' | 'show_schedule' |
  'name'
  >,
  compact?: boolean,
};

function ConventionFormHeader({ convention, compact }: ConventionFormHeaderProps) {
  const conventionTiming = useMemo(
    () => describeConventionTiming(
      convention.starts_at,
      convention.ends_at,
      timezoneNameForConvention(convention),
      convention.canceled,
    ),
    [convention],
  );

  const signupsDescription = useMemo(
    () => describeMaximumEventSignups(convention.maximum_event_signups),
    [convention.maximum_event_signups],
  );

  const metadata = [
    ...(
      convention.site_mode === 'single_event'
        ? [{ label: 'Site mode', value: 'Single event' }]
        : [
          { label: 'Event list', value: describeEventVisibility(convention.show_event_list) },
          { label: 'Schedule', value: describeEventVisibility(convention.show_schedule) },
        ]
    ),
    { label: 'Signups', value: signupsDescription },
  ];

  return (
    <header>
      <h1>
        {convention.name}
        {' '}
        <span className="h3">
          {conventionTiming}
        </span>
      </h1>
      {compact
        ? (
          <div className="row">
            {metadata.map(({ label, value }) => (
              <div className="col-md-4" key={label}>
                {value
                  ? (
                    <>
                      <strong>
                        {label}
                        :
                      </strong>
                      {' '}
                      {value}
                    </>
                  )
                  : <strong>{label}</strong>}
              </div>
            ))}
          </div>
        )
        : (
          <dl className="row mb-0">
            {metadata.map(({ label, value }) => (
              <React.Fragment key={label}>
                <dt className="col-md-3">{label}</dt>
                <dd className="col-md-9">{value}</dd>
              </React.Fragment>
            ))}
          </dl>
        )}
    </header>
  );
}

export default React.memo(ConventionFormHeader, (prevProps, nextProps) => (
  prevProps.compact === nextProps.compact
  && prevProps.convention.name === nextProps.convention.name
  && prevProps.convention.starts_at === nextProps.convention.starts_at
  && prevProps.convention.ends_at === nextProps.convention.ends_at
  && prevProps.convention.canceled === nextProps.convention.canceled
  && prevProps.convention.timezone_name === nextProps.convention.timezone_name
  && prevProps.convention.show_event_list === nextProps.convention.show_event_list
  && prevProps.convention.show_schedule === nextProps.convention.show_schedule
  && prevProps.convention.maximum_event_signups === nextProps.convention.maximum_event_signups
));

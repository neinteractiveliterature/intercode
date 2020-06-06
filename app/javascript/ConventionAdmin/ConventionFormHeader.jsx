import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { findCurrentValue } from '../ScheduledValueUtils';
import { MAXIMUM_EVENT_SIGNUPS_OPTIONS } from './ConventionFormEventsSection';
import pluralizeWithCount from '../pluralizeWithCount';
import { timezoneNameForConvention } from '../TimeUtils';

function describeEventVisibility(visibility) {
  switch (visibility) {
    case 'no': return 'Hidden';
    case 'priv': return 'Staff only';
    case 'gms': return 'Staff and event teams';
    case 'yes': return 'Public';
    default: return visibility;
  }
}

function describeMaximumEventSignups(scheduledValue) {
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

function describeConventionTiming(startsAt, endsAt, timezoneName, canceled) {
  if (canceled) {
    return 'is canceled';
  }

  const now = moment.tz({}, timezoneName).startOf('day');
  const conventionStart = moment.tz(startsAt, timezoneName).startOf('day');
  const conventionEnd = moment.tz(endsAt, timezoneName).startOf('day');

  if (now.isBefore(conventionStart)) {
    return `starts in ${pluralizeWithCount('day', conventionStart.diff(now, 'day'))}`;
  }

  if (now.isBefore(conventionEnd)) {
    return `ends in ${pluralizeWithCount('day', conventionEnd.diff(now, 'day'))}`;
  }

  if (conventionEnd.isBefore(now)) {
    return `ended ${pluralizeWithCount('day', now.diff(conventionEnd, 'day'))} ago`;
  }

  const isMultiDay = conventionStart.isBefore(conventionEnd);
  return `${isMultiDay ? 'ends' : 'is'} today`;
}

function ConventionFormHeader({ convention, compact }) {
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

ConventionFormHeader.propTypes = {
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    canceled: PropTypes.bool.isRequired,
    timezone_name: PropTypes.string.isRequired,
    show_event_list: PropTypes.string.isRequired,
    show_schedule: PropTypes.string.isRequired,
    site_mode: PropTypes.string.isRequired,
    maximum_event_signups: PropTypes.shape({
      timespans: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        start: PropTypes.string,
        finish: PropTypes.string,
      })).isRequired,
    }).isRequired,
  }).isRequired,
  compact: PropTypes.bool,
};

ConventionFormHeader.defaultProps = {
  compact: false,
};

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

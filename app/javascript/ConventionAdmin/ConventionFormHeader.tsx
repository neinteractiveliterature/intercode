import { memo, Fragment, useMemo } from 'react';
import { DateTime } from 'luxon';

import { findCurrentValue } from '../ScheduledValueUtils';
import {
  MaximumEventSignupsValue,
  MAXIMUM_EVENT_SIGNUPS_OPTIONS,
} from './MaximumEventSignupsPreview';
import pluralizeWithCount from '../pluralizeWithCount';
import { timezoneNameForConvention } from '../TimeUtils';
import { ShowSchedule } from '../graphqlTypes.generated';
import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import { ConventionAdminConventionQueryData } from './queries.generated';

function describeEventVisibility(visibility: ShowSchedule | null | undefined) {
  switch (visibility) {
    case 'no':
      return 'Hidden';
    case 'priv':
      return 'Staff only';
    case 'gms':
      return 'Staff and event teams';
    case 'yes':
      return 'Public';
    default:
      return visibility;
  }
}

function describeMaximumEventSignups(
  scheduledValue: EditingScheduledValue<MaximumEventSignupsValue> | null | undefined,
) {
  if (!scheduledValue) {
    return 'Signup schedule not configured yet';
  }

  const currentValue = findCurrentValue(scheduledValue);

  if (!currentValue) {
    return 'No signups yet';
  }

  const currentOption = MAXIMUM_EVENT_SIGNUPS_OPTIONS.find(([option]) => currentValue === option);
  if (!currentOption) {
    return currentValue;
  }

  return currentOption[1];
}

function describeConventionTiming(
  startsAt: string | null | undefined,
  endsAt: string | null | undefined,
  timezoneName: string,
  canceled: boolean,
) {
  if (canceled) {
    return 'is canceled';
  }

  const now = DateTime.fromObject({}, { zone: timezoneName }).startOf('day');
  const conventionStart = startsAt
    ? DateTime.fromISO(startsAt, { zone: timezoneName }).startOf('day')
    : undefined;
  const conventionEnd = endsAt
    ? DateTime.fromISO(endsAt, { zone: timezoneName }).startOf('day')
    : undefined;

  if (!conventionStart || !conventionEnd) {
    return '';
  }

  if (now < conventionStart) {
    return `starts in ${pluralizeWithCount(
      'day',
      Math.ceil(conventionStart.diff(now, 'days').days),
    )}`;
  }

  if (now < conventionEnd) {
    return `ends in ${pluralizeWithCount('day', Math.ceil(conventionEnd.diff(now, 'days').days))}`;
  }

  if (conventionEnd < now) {
    return `ended ${pluralizeWithCount(
      'day',
      Math.floor(now.diff(conventionEnd, 'days').days),
    )} ago`;
  }

  const isMultiDay = conventionStart < conventionEnd;
  return `${isMultiDay ? 'ends' : 'is'} today`;
}

export type ConventionFormHeaderProps = {
  convention: Pick<
    ConventionAdminConventionQueryData['convention'],
    | 'id'
    | 'name'
    | 'starts_at'
    | 'ends_at'
    | 'timezone_name'
    | 'timezone_mode'
    | 'site_mode'
    | 'show_event_list'
    | 'show_schedule'
    | 'canceled'
  > & {
    maximum_event_signups?: EditingScheduledValue<string> | null;
  };
  compact?: boolean;
};

function ConventionFormHeader({ convention, compact }: ConventionFormHeaderProps) {
  const conventionTiming = useMemo(
    () =>
      describeConventionTiming(
        convention.starts_at,
        convention.ends_at,
        timezoneNameForConvention(convention),
        convention.canceled,
      ),
    [convention],
  );

  const signupsDescription = useMemo(
    () =>
      describeMaximumEventSignups(
        convention.maximum_event_signups as
          | EditingScheduledValue<MaximumEventSignupsValue>
          | null
          | undefined,
      ),
    [convention.maximum_event_signups],
  );

  const metadata = [
    ...(convention.site_mode === 'single_event'
      ? [{ label: 'Site mode', value: 'Single event' }]
      : [
          { label: 'Event list', value: describeEventVisibility(convention.show_event_list) },
          { label: 'Schedule', value: describeEventVisibility(convention.show_schedule) },
        ]),
    { label: 'Signups', value: signupsDescription },
  ];

  return (
    <header>
      <h1>
        {convention.name} <span className="h3">{conventionTiming}</span>
      </h1>
      {compact ? (
        <div className="row">
          {metadata.map(({ label, value }) => (
            <div className="col-md-4" key={label}>
              {value ? (
                <>
                  <strong>{label}:</strong> {value}
                </>
              ) : (
                <strong>{label}</strong>
              )}
            </div>
          ))}
        </div>
      ) : (
        <dl className="row mb-0">
          {metadata.map(({ label, value }) => (
            <Fragment key={label}>
              <dt className="col-md-3">{label}</dt>
              <dd className="col-md-9">{value}</dd>
            </Fragment>
          ))}
        </dl>
      )}
    </header>
  );
}

export default memo(
  ConventionFormHeader,
  (prevProps, nextProps) =>
    prevProps.compact === nextProps.compact &&
    prevProps.convention.name === nextProps.convention.name &&
    prevProps.convention.starts_at === nextProps.convention.starts_at &&
    prevProps.convention.ends_at === nextProps.convention.ends_at &&
    prevProps.convention.canceled === nextProps.convention.canceled &&
    prevProps.convention.timezone_name === nextProps.convention.timezone_name &&
    prevProps.convention.show_event_list === nextProps.convention.show_event_list &&
    prevProps.convention.show_schedule === nextProps.convention.show_schedule &&
    prevProps.convention.maximum_event_signups === nextProps.convention.maximum_event_signups,
);

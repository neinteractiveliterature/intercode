import { memo, Fragment, useMemo } from 'react';
import { DateTime } from 'luxon';

import { findCurrentValue } from '../ScheduledValueUtils';
import { timezoneNameForConvention } from '../TimeUtils';
import { ShowSchedule } from '../graphqlTypes.generated';
import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import { ConventionAdminConventionQueryData } from './queries.generated';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { describeMaximumEventSignupsValue } from '../describeMaximumEventSignupsValue';
import { MaximumEventSignupsValue } from '../SignupRoundUtils';

function describeEventVisibility(visibility: ShowSchedule | null | undefined, t: TFunction): string | null | undefined {
  switch (visibility) {
    case 'no':
      return t('admin.convention.header.eventVisibilityHidden');
    case 'priv':
      return t('admin.convention.header.eventVisibilityPriv');
    case 'gms':
      return t('admin.convention.header.eventVisibilityGMs');
    case 'yes':
      return t('admin.convention.header.eventVisibilityYes');
    default:
      return visibility;
  }
}

function describeMaximumEventSignups(
  scheduledValue: EditingScheduledValue<MaximumEventSignupsValue> | null | undefined,
  t: TFunction,
): string | null | undefined {
  if (!scheduledValue) {
    return t('admin.convention.header.signupScheduleNotConfiguredYet');
  }

  const currentValue = findCurrentValue(scheduledValue);
  return describeMaximumEventSignupsValue(currentValue, t);
}

function describeConventionTiming(
  conventionName: string,
  startsAt: string | null | undefined,
  endsAt: string | null | undefined,
  timezoneName: string,
  canceled: boolean,
  t: TFunction,
): string {
  if (canceled) {
    return t('admin.convention.header.conventionTiming.canceled', {
      conventionName,
    });
  }

  const now = DateTime.fromObject({}, { zone: timezoneName }).startOf('day');
  const conventionStart = startsAt ? DateTime.fromISO(startsAt, { zone: timezoneName }).startOf('day') : undefined;
  const conventionEnd = endsAt ? DateTime.fromISO(endsAt, { zone: timezoneName }).startOf('day') : undefined;

  if (!conventionStart || !conventionEnd) {
    return '';
  }

  if (now < conventionStart) {
    return t('admin.convention.header.conventionTiming.future', {
      conventionName,
      count: Math.ceil(conventionStart.diff(now, 'days').days),
    });
  }

  if (now < conventionEnd) {
    return t('admin.convention.header.conventionTiming.ongoing', {
      conventionName,
      count: Math.ceil(conventionEnd.diff(now, 'days').days),
    });
  }

  if (conventionEnd < now) {
    return t('admin.convention.header.conventionTiming.past', {
      conventionName,
      count: Math.floor(now.diff(conventionEnd, 'days').days),
    });
  }

  const isMultiDay = conventionStart < conventionEnd;
  if (isMultiDay) {
    return t('admin.convention.header.conventionTiming.endsToday', {
      conventionName,
    });
  }
  return t('admin.convention.header.conventionTiming.isToday', {
    conventionName,
  });
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
  const { t } = useTranslation();
  const conventionTiming = useMemo(
    () =>
      describeConventionTiming(
        convention.name,
        convention.starts_at,
        convention.ends_at,
        timezoneNameForConvention(convention),
        convention.canceled,
        t,
      ),
    [convention, t],
  );

  const signupsDescription = useMemo(
    () =>
      describeMaximumEventSignups(
        convention.maximum_event_signups as EditingScheduledValue<MaximumEventSignupsValue> | null | undefined,
        t,
      ),
    [convention.maximum_event_signups, t],
  );

  const metadata = [
    ...(convention.site_mode === 'single_event'
      ? [
          {
            label: t('admin.convention.header.siteMode'),
            value: t('admin.convention.header.singleEventSiteMode'),
          },
        ]
      : [
          {
            label: t('admin.convention.header.eventList'),
            value: describeEventVisibility(convention.show_event_list, t),
          },
          {
            label: t('admin.convention.header.schedule'),
            value: describeEventVisibility(convention.show_schedule, t),
          },
        ]),
    { label: t('admin.convention.header.signups'), value: signupsDescription },
  ];

  return (
    <header>
      <h1>
        <span className="h3">{conventionTiming}</span>
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

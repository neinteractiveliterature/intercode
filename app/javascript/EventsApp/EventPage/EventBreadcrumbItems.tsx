import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { ConventionForTimespanUtils, getConventionDayTimespans, timespanFromConvention } from '../../TimespanUtils';
import AppRootContext from '../../AppRootContext';
import { Run } from '../../graphqlTypes.generated';
import { useConventionDayUrlPortion } from '../conventionDayUrls';
import NamedRouteBreadcrumbItem from '../../Breadcrumbs/NamedRouteBreadcrumbItem';

function findRunFromHash<RunType extends { id: string }>(runs: RunType[], hash?: string | null) {
  if (!hash) {
    return undefined;
  }

  return runs.find((run) => `#run-${run.id}` === hash);
}

function getConventionDayStart(
  run: Pick<Run, 'starts_at'>,
  convention: ConventionForTimespanUtils,
  timezoneName: string,
) {
  const conventionTimespan = timespanFromConvention(convention);
  if (!run || !conventionTimespan.isFinite()) {
    return conventionTimespan.start;
  }

  const runStart = DateTime.fromISO(run.starts_at, { zone: timezoneName });
  const conventionDayTimespans = getConventionDayTimespans(conventionTimespan, timezoneName);
  const conventionDay = conventionDayTimespans.find((timespan) => timespan.includesTime(runStart));
  return conventionDay?.start ?? conventionTimespan.start;
}

export type EventBreadcrumbItemsProps = {
  event: {
    title?: string | null;
    runs: (Pick<Run, 'starts_at'> & { id: string })[];
  };
  convention: ConventionForTimespanUtils;
  currentAbility: {
    can_read_schedule: boolean;
  };
  eventPath: string;
};

function EventBreadcrumbItems({ event, convention, currentAbility }: EventBreadcrumbItemsProps): JSX.Element {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const location = useLocation();
  const runToLink = findRunFromHash(event.runs, location.hash) || event.runs[0];
  const conventionDayStart = getConventionDayStart(runToLink, convention, timezoneName);
  const conventionDayUrlPortion = useConventionDayUrlPortion();

  return (
    <>
      <li className="breadcrumb-item">
        {currentAbility.can_read_schedule && event.runs.length > 0 ? (
          <Link
            to={
              conventionDayStart
                ? `/events/schedule/${conventionDayUrlPortion(conventionDayStart)}`
                : '/events/schedule'
            }
          >
            {t('navigation.events.eventSchedule')}
          </Link>
        ) : (
          <Link to="/events">{t('navigation.events.eventsList')}</Link>
        )}
      </li>
      <NamedRouteBreadcrumbItem routeId="EventPage">{event.title}</NamedRouteBreadcrumbItem>
    </>
  );
}

export default EventBreadcrumbItems;

import { useCallback, useMemo, useContext, ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useApolloClient } from '@apollo/client';

import { getConventionDayTimespans } from '../../TimespanUtils';
import RefreshButton from './RefreshButton';
import AppRootContext from '../../AppRootContext';
import { FiniteTimespan } from '../../Timespan';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { ScheduleGridEventsQueryDocument } from './queries.generated';
import { useConventionDayUrlPortion } from '../conventionDayUrls';
import { useTranslation } from 'react-i18next';

type ConventionDayTabProps = {
  basename: string;
  timespan: FiniteTimespan;
  prefetchTimespan?: (timespan: FiniteTimespan) => Promise<unknown>;
};

function ConventionDayTab({ basename, timespan, prefetchTimespan }: ConventionDayTabProps) {
  const location = useLocation();
  const format = useAppDateTimeFormat();
  const conventionDayUrlPortion = useConventionDayUrlPortion();
  const prefetchProps = prefetchTimespan
    ? {
        onMouseOver: () => prefetchTimespan(timespan),
        onFocus: () => prefetchTimespan(timespan),
      }
    : {};

  return (
    <li className="nav-item">
      <NavLink
        to={`${basename}/${conventionDayUrlPortion(timespan.start)}${location.search}`}
        className="nav-link"
        {...prefetchProps}
      >
        <span className="d-inline d-md-none">{format(timespan.start, 'shortWeekday')}</span>
        <span className="d-none d-md-inline">{format(timespan.start, 'longWeekday')}</span>
      </NavLink>
    </li>
  );
}

export type ConventionDayTabContainerProps = {
  basename: string;
  conventionTimespan: FiniteTimespan;
  children: ReactNode;
  prefetchTimespan?: (timespan: FiniteTimespan) => Promise<unknown>;
};

function ConventionDayTabContainer({
  basename,
  conventionTimespan,
  prefetchTimespan,
  children,
}: ConventionDayTabContainerProps): React.JSX.Element {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const client = useApolloClient();
  const refreshData = useCallback(
    () =>
      client.query({
        query: ScheduleGridEventsQueryDocument,
        fetchPolicy: 'network-only',
      }),
    [client],
  );

  const conventionDayTimespans = useMemo(
    () => (conventionTimespan.isFinite() ? getConventionDayTimespans(conventionTimespan, timezoneName) : []),
    [conventionTimespan, timezoneName],
  );

  if (!conventionTimespan.isFinite()) {
    return <div className="alert alert-warning">{t('schedule.conventionTimespanIsInfinite')}</div>;
  }

  return (
    <div>
      <div className="d-flex flex-wrap">
        <ul className="nav nav-tabs flex-grow-1">
          {conventionDayTimespans.map((timespan) => (
            <ConventionDayTab
              basename={basename}
              timespan={timespan}
              prefetchTimespan={prefetchTimespan}
              key={timespan.start.toISO()}
            />
          ))}
        </ul>

        <div className="border-bottom border-color-light ps-2">
          <RefreshButton refreshData={refreshData} />
        </div>
      </div>
      {children}
    </div>
  );
}

export default ConventionDayTabContainer;

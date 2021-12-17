import { useCallback, useMemo, useContext } from 'react';
import { NavLink, Routes, Navigate, Route, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { DateTime } from 'luxon';

import { getConventionDayTimespans } from '../../TimespanUtils';
import RefreshButton from './RefreshButton';
import AppRootContext from '../../AppRootContext';
import Timespan, { FiniteTimespan } from '../../Timespan';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { SiteMode } from '../../graphqlTypes.generated';
import { DateTimeFormatKey } from '../../DateTimeFormats';
import { ScheduleGridCombinedQueryDocument } from './queries.generated';

function conventionDayUrlPortionFormat(
  siteMode: SiteMode | undefined,
  conventionTimespan: Timespan | undefined,
): DateTimeFormatKey {
  const conventionLengthInDays = conventionTimespan?.getLength('days');
  if (siteMode === SiteMode.Convention && conventionLengthInDays && conventionLengthInDays.days < 7) {
    return 'longWeekday';
  }

  return 'compactDate';
}

export function buildConventionDayUrlPortion(
  dayStart: DateTime,
  format: ReturnType<typeof useAppDateTimeFormat>,
  siteMode: SiteMode | undefined,
  conventionTimespan: Timespan | undefined,
): string {
  return format(dayStart, conventionDayUrlPortionFormat(siteMode, conventionTimespan)).toLowerCase();
}

export function useConventionDayUrlPortion(): (dayStart: DateTime) => string {
  const format = useAppDateTimeFormat();
  const { conventionTimespan, siteMode } = useContext(AppRootContext);

  return useCallback(
    (dayStart) => buildConventionDayUrlPortion(dayStart, format, siteMode, conventionTimespan),
    [format, siteMode, conventionTimespan],
  );
}

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
  children: (timespan: FiniteTimespan) => JSX.Element;
  prefetchTimespan?: (timespan: FiniteTimespan) => Promise<unknown>;
  showExtendedCounts?: boolean;
};

function ConventionDayTabContainer({
  basename,
  conventionTimespan,
  prefetchTimespan,
  children,
  showExtendedCounts,
}: ConventionDayTabContainerProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const client = useApolloClient();
  const conventionDayUrlPortion = useConventionDayUrlPortion();
  const refreshData = useCallback(
    () =>
      client.query({
        query: ScheduleGridCombinedQueryDocument,
        variables: { extendedCounts: showExtendedCounts || false },
        fetchPolicy: 'network-only',
      }),
    [client, showExtendedCounts],
  );

  const conventionDayTimespans = useMemo(
    () => (conventionTimespan.isFinite() ? getConventionDayTimespans(conventionTimespan, timezoneName) : []),
    [conventionTimespan, timezoneName],
  );

  if (!conventionTimespan.isFinite()) {
    return <div className="alert alert-warning">Convention start/end dates have not yet been set.</div>;
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
      <Routes>
        {conventionDayTimespans.map((timespan) => (
          <Route path={`${basename}/${conventionDayUrlPortion(timespan.start)}`} key={timespan.start.toISO()}>
            {children(timespan)}
          </Route>
        ))}
        <Route
          path={basename}
          element={<Navigate to={`${basename}/${conventionDayUrlPortion(conventionDayTimespans[0].start)}`} replace />}
        />
      </Routes>
    </div>
  );
}

export default ConventionDayTabContainer;

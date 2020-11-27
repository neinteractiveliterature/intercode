import { useCallback, useMemo, useContext } from 'react';
import { NavLink, Switch, Redirect, Route, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import { getConventionDayTimespans } from '../../TimespanUtils';
import RefreshButton from './RefreshButton';
import { ScheduleGridCombinedQuery } from './queries';
import AppRootContext from '../../AppRootContext';
import { FiniteTimespan } from '../../Timespan';
import { useAppDateTimeFormat } from '../../TimeUtils';

type ConventionDayTabProps = {
  basename: string;
  timespan: FiniteTimespan;
  prefetchTimespan?: (timespan: FiniteTimespan) => Promise<any>;
};

function ConventionDayTab({ basename, timespan, prefetchTimespan }: ConventionDayTabProps) {
  const location = useLocation();
  const format = useAppDateTimeFormat();
  const prefetchProps = prefetchTimespan
    ? {
        onMouseOver: () => prefetchTimespan(timespan),
        onFocus: () => prefetchTimespan(timespan),
      }
    : {};

  return (
    <li className="nav-item">
      <NavLink
        to={`${basename}/${format(timespan.start, 'longWeekday').toLowerCase()}${location.search}`}
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
  prefetchTimespan?: (timespan: FiniteTimespan) => Promise<any>;
  showExtendedCounts?: boolean;
};

function ConventionDayTabContainer({
  basename,
  conventionTimespan,
  prefetchTimespan,
  children,
  showExtendedCounts,
}: ConventionDayTabContainerProps) {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const client = useApolloClient();
  const refreshData = useCallback(
    () =>
      client.query({
        query: ScheduleGridCombinedQuery,
        variables: { extendedCounts: showExtendedCounts || false },
        fetchPolicy: 'network-only',
      }),
    [client, showExtendedCounts],
  );

  const conventionDayTimespans = useMemo(
    () =>
      conventionTimespan.isFinite()
        ? getConventionDayTimespans(conventionTimespan, timezoneName)
        : [],
    [conventionTimespan, timezoneName],
  );

  if (!conventionTimespan.isFinite()) {
    return (
      <div className="alert alert-warning">Convention start/end dates have not yet been set.</div>
    );
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

        <div className="border-bottom border-color-light pl-2">
          <RefreshButton refreshData={refreshData} />
        </div>
      </div>
      <Switch>
        {conventionDayTimespans.map((timespan) => (
          <Route
            path={`${basename}/${format(timespan.start, 'longWeekday').toLowerCase()}`}
            key={timespan.start.toISO()}
          >
            {children(timespan)}
          </Route>
        ))}
        <Redirect
          to={`${basename}/${format(conventionDayTimespans[0].start, 'longWeekday').toLowerCase()}`}
        />
      </Switch>
    </div>
  );
}

export default ConventionDayTabContainer;

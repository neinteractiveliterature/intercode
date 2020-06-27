import React, { useCallback, useMemo, useContext } from 'react';
import {
  NavLink, Switch, Redirect, Route, useLocation,
} from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import { getConventionDayTimespans } from '../../TimespanUtils';
import RefreshButton from './RefreshButton';
import { ScheduleGridCombinedQueryDocument, ScheduleGridCombinedQueryQuery } from './queries.generated';
import AppRootContext from '../../AppRootContext';
import Timespan from '../../Timespan';

import type { FiniteTimespan } from '../../Timespan';

type ConventionDayTabProps = {
  basename: string,
  timespan: FiniteTimespan,
  prefetchTimespan: (timespan: Timespan) => void | null,
};

function ConventionDayTab(
  { basename, timespan, prefetchTimespan }: ConventionDayTabProps,
): JSX.Element {
  const location = useLocation();
  const prefetchProps = (
    prefetchTimespan
      ? ({
        onMouseOver: () => prefetchTimespan(timespan),
        onFocus: () => prefetchTimespan(timespan),
      })
      : {}
  );

  return (
    <li className="nav-item">
      <NavLink
        to={`${basename}/${timespan.start.toFormat('EEEE').toLowerCase()}${location.search}`}
        className="nav-link"
        {...prefetchProps}
      >
        <span className="d-inline d-md-none">
          {timespan.start.toFormat('EEE')}
        </span>
        <span className="d-none d-md-inline">
          {timespan.start.toFormat('EEEE')}
        </span>
      </NavLink>
    </li>
  );
}

export type ConventionDayTabContainerProps = {
  basename: string,
  conventionTimespan: Timespan | null,
  prefetchTimespan: (Timespan) => any,
  children: (Timespan) => JSX.Element,
  showExtendedCounts?: boolean,
};

function ConventionDayTabContainer({
  basename, conventionTimespan, prefetchTimespan, children, showExtendedCounts,
}: ConventionDayTabContainerProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const client = useApolloClient();
  const refreshData = useCallback(
    () => client.query<ScheduleGridCombinedQueryQuery>({
      query: ScheduleGridCombinedQueryDocument,
      variables: { extendedCounts: showExtendedCounts || false },
      fetchPolicy: 'network-only',
    }),
    [client, showExtendedCounts],
  );

  const conventionDayTimespans = useMemo(
    () => (
      conventionTimespan?.isFinite()
        ? getConventionDayTimespans(
          conventionTimespan,
          timezoneName,
        )
        : []
    ),
    [conventionTimespan, timezoneName],
  );

  if (!conventionTimespan?.isFinite()) {
    return (
      <div className="alert alert-warning">
        Convention start/end dates have not yet been set.
      </div>
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
            path={`${basename}/${timespan.start.toFormat('EEEE').toLowerCase()}`}
            key={timespan.start.toISO()}
          >
            {children(timespan)}
          </Route>
        ))}
        <Redirect to={`${basename}/${conventionDayTimespans[0].start.toFormat('EEEE').toLowerCase()}`} />
      </Switch>
    </div>
  );
}

export default ConventionDayTabContainer;

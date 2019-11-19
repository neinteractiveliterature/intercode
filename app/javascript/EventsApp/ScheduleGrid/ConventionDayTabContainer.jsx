import React, { useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import {
  NavLink, Switch, Redirect, Route, withRouter,
} from 'react-router-dom';
import { useApolloClient } from 'react-apollo-hooks';

import { getConventionDayTimespans } from '../../TimespanUtils';
import RefreshButton from './RefreshButton';
import { ScheduleGridCombinedQuery } from './queries.gql';

function ConventionDayTab({
  basename, timespan, prefetchTimespan, location,
}) {
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
        to={`${basename}/${timespan.start.format('dddd').toLowerCase()}${location.search}`}
        className="nav-link"
        {...prefetchProps}
      >
        <span className="d-inline d-md-none">
          {timespan.start.format('ddd')}
        </span>
        <span className="d-none d-md-inline">
          {timespan.start.format('dddd')}
        </span>
      </NavLink>
    </li>
  );
}

ConventionDayTab.propTypes = {
  basename: PropTypes.string.isRequired,
  timespan: PropTypes.shape({
    start: MomentPropTypes.momentObj.isRequired,
  }).isRequired,
  prefetchTimespan: PropTypes.func,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

ConventionDayTab.defaultProps = {
  prefetchTimespan: null,
};

const ConventionDayTabWithRouter = withRouter(ConventionDayTab);

function ConventionDayTabContainer({
  basename, conventionTimespan, timezoneName, prefetchTimespan, children, showExtendedCounts,
}) {
  const client = useApolloClient();
  const refreshData = useCallback(
    () => client.query({
      query: ScheduleGridCombinedQuery,
      variables: { extendedCounts: showExtendedCounts || false },
      fetchPolicy: 'network-only',
    }),
    [client, showExtendedCounts],
  );

  const conventionDayTimespans = useMemo(
    () => (
      conventionTimespan.isFinite()
        ? getConventionDayTimespans(
          conventionTimespan,
          timezoneName,
        )
        : []
    ),
    [conventionTimespan, timezoneName],
  );

  if (!conventionTimespan.isFinite()) {
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
            <ConventionDayTabWithRouter
              basename={basename}
              timespan={timespan}
              prefetchTimespan={prefetchTimespan}
              key={timespan.start.toISOString()}
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
            path={`${basename}/${timespan.start.format('dddd').toLowerCase()}`}
            render={() => children(timespan)}
            key={timespan.start.toISOString()}
          />
        ))}
        <Redirect to={`${basename}/${conventionDayTimespans[0].start.format('dddd').toLowerCase()}`} />
      </Switch>
    </div>
  );
}

ConventionDayTabContainer.propTypes = {
  basename: PropTypes.string.isRequired,
  conventionTimespan: PropTypes.shape({
    start: MomentPropTypes.momentObj.isRequired,
    finish: MomentPropTypes.momentObj.isRequired,
    isFinite: PropTypes.func.isRequired,
  }).isRequired,
  timezoneName: PropTypes.string.isRequired,
  prefetchTimespan: PropTypes.func,
  children: PropTypes.func.isRequired,
  showExtendedCounts: PropTypes.bool,
};

ConventionDayTabContainer.defaultProps = {
  prefetchTimespan: null,
  showExtendedCounts: false,
};

export default ConventionDayTabContainer;

import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import {
  NavLink, Switch, Redirect, Route,
} from 'react-router-dom';

import { getConventionDayTimespans } from '../../TimespanUtils';
import RefreshButton from './RefreshButton';

function ConventionDayTabContainer({
  basename, conventionTimespan, timezoneName, prefetchTimespan, children, refreshData,
}) {
  if (!conventionTimespan.isFinite()) {
    return (
      <div className="alert alert-warning">
        Convention start/end dates have not yet been set.
      </div>
    );
  }

  const conventionDayTimespans = getConventionDayTimespans(
    conventionTimespan,
    timezoneName,
  );

  const conventionDayTabs = conventionDayTimespans.map((timespan) => {
    const prefetchProps = (
      prefetchTimespan
        ? ({
          onMouseOver: () => prefetchTimespan(timespan),
          onFocus: () => prefetchTimespan(timespan),
        })
        : {}
    );

    return (
      <li className="nav-item" key={timespan.start.toISOString()}>
        <NavLink
          to={`${basename}/${timespan.start.format('dddd').toLowerCase()}`}
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
  });

  const conventionDayRoutes = conventionDayTimespans.map(timespan => (
    <Route
      path={`${basename}/${timespan.start.format('dddd').toLowerCase()}`}
      render={() => children(timespan)}
      key={timespan.start.toISOString()}
    />
  ));

  return (
    <div>
      <div className="d-flex flex-wrap">
        <ul className="nav nav-tabs flex-grow-1">
          {conventionDayTabs}
        </ul>

        <div className="border-bottom border-color-light pl-2">
          <RefreshButton refreshData={refreshData} />
        </div>
      </div>
      <Switch>
        {conventionDayRoutes}
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
  }).isRequired,
  timezoneName: PropTypes.string.isRequired,
  prefetchTimespan: PropTypes.func,
  children: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
};

ConventionDayTabContainer.defaultProps = {
  prefetchTimespan: null,
};

export default ConventionDayTabContainer;

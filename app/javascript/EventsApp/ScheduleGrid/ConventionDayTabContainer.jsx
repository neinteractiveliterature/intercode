import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import {
  NavLink, Switch, Redirect, Route,
} from 'react-router-dom';

import { getConventionDayTimespans } from '../../TimespanUtils';

function ConventionDayTabContainer({
  basename, conventionTimespan, timezoneName, prefetchTimespan, children,
}) {
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
      <ul className="nav nav-tabs">
        {conventionDayTabs}
      </ul>
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
};

ConventionDayTabContainer.defaultProps = {
  prefetchTimespan: null,
};

export default ConventionDayTabContainer;

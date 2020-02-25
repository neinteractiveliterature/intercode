import React from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch } from 'react-router-dom';

import BreadcrumbItem from './BreadcrumbItem';

function BreadcrumbItemWithRoute({
  active, hideUnlessMatch, path, exact, to, children,
}) {
  const match = useRouteMatch({ path, exact });

  const item = (
    <BreadcrumbItem to={to} active={active ?? !!match}>
      {children}
    </BreadcrumbItem>
  );

  if (hideUnlessMatch) {
    return <Route path={path} exact={exact}>{item}</Route>;
  }

  return item;
}

BreadcrumbItemWithRoute.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  hideUnlessMatch: PropTypes.bool,
};

BreadcrumbItemWithRoute.defaultProps = {
  active: null,
  exact: false,
  hideUnlessMatch: false,
};

export default BreadcrumbItemWithRoute;

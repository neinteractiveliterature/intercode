import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import BreadcrumbItem from './BreadcrumbItem';

function BreadcrumbItemWithRoute({
  active, hideUnlessMatch, path, exact, to, children,
}) {
  const buildActive = (routeProps) => {
    if (active) {
      return active(routeProps);
    }

    return routeProps.match != null;
  };

  const buildToString = (routeProps) => {
    if (typeof to === 'string') {
      return to;
    }

    return to(routeProps);
  };

  const renderBreadcrumbItem = (routeProps) => (
    <BreadcrumbItem
      to={buildToString(routeProps)}
      active={buildActive(routeProps)}
    >
      {
        typeof children === 'function'
          ? children(routeProps)
          : children
      }
    </BreadcrumbItem>
  );

  const routeRenderingProps = {};
  if (hideUnlessMatch) {
    routeRenderingProps.render = renderBreadcrumbItem;
  } else {
    routeRenderingProps.children = renderBreadcrumbItem;
  }

  return <Route path={path} exact={exact} {...routeRenderingProps} />;
}

BreadcrumbItemWithRoute.propTypes = {
  active: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  hideUnlessMatch: PropTypes.bool,
};

BreadcrumbItemWithRoute.defaultProps = {
  active: null,
  exact: false,
  hideUnlessMatch: false,
};

export default BreadcrumbItemWithRoute;

import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import BreadcrumbItem from './BreadcrumbItem';

function RouteActivatedBreadcrumbItem({ to, children, matchProps }) {
  const match = useRouteMatch(matchProps);

  return (
    <BreadcrumbItem to={to} active={!!match}>
      {children}
    </BreadcrumbItem>
  );
}

RouteActivatedBreadcrumbItem.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  matchProps: PropTypes.shape({}).isRequired,
};

export default RouteActivatedBreadcrumbItem;

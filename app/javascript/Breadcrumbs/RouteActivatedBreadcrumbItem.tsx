import React, { ReactNode } from 'react';
import { useRouteMatch, RouteProps } from 'react-router-dom';

import BreadcrumbItem from './BreadcrumbItem';

export type RouteActivatedBreadcrumbItemProps = {
  to: string,
  matchProps: RouteProps,
  children: ReactNode,
};

function RouteActivatedBreadcrumbItem(
  { to, children, matchProps }: RouteActivatedBreadcrumbItemProps,
) {
  const match = useRouteMatch(matchProps);

  return (
    <BreadcrumbItem to={to} active={!!match}>
      {children}
    </BreadcrumbItem>
  );
}

export default RouteActivatedBreadcrumbItem;

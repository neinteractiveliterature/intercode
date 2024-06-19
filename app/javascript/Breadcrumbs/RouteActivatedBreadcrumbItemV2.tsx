import { ReactNode } from 'react';
import { To, matchRoutes, useLocation } from 'react-router';

import BreadcrumbItem from './BreadcrumbItem';

export type RouteActivatedBreadcrumbItemV2Props = {
  to: To;
  route: Parameters<typeof matchRoutes>[0][number];
  children: ReactNode;
  hideUnlessMatch?: boolean;
};

function RouteActivatedBreadcrumbItemV2({
  to,
  children,
  route,
  hideUnlessMatch,
}: RouteActivatedBreadcrumbItemV2Props): JSX.Element {
  const location = useLocation();

  const match = matchRoutes([route], location);

  if (hideUnlessMatch && !match) {
    return <></>;
  }

  return (
    <BreadcrumbItem to={to} active={match != null}>
      {children}
    </BreadcrumbItem>
  );
}

export default RouteActivatedBreadcrumbItemV2;

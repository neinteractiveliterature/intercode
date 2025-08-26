import { ReactNode } from 'react';

import BreadcrumbItem from './BreadcrumbItem';
import { RouteName } from '../AppRouter';
import { useNamedRouteMatch } from '../useNamedRouteMatch';

export type NamedRouteBreadcrumbItemProps = {
  routeId: RouteName | RouteName[];
  children: ReactNode;
};

function NamedRouteBreadcrumbItem({ children, routeId }: NamedRouteBreadcrumbItemProps): React.JSX.Element {
  const { match, active, to } = useNamedRouteMatch(routeId);

  if (!match) {
    return <></>;
  }

  return (
    <BreadcrumbItem to={to} active={active}>
      {children}
    </BreadcrumbItem>
  );
}

export default NamedRouteBreadcrumbItem;

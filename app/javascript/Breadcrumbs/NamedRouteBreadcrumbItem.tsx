import { ReactNode, useMemo } from 'react';
import { generatePath, useMatches, useParams } from 'react-router';

import BreadcrumbItem from './BreadcrumbItem';
import { NamedRoute } from '../AppRouter';

export type NamedRouteBreadcrumbItemProps = {
  routeId: NamedRoute | NamedRoute[];
  children: ReactNode;
  hideUnlessMatch?: boolean;
};

function NamedRouteBreadcrumbItem({ children, routeId, hideUnlessMatch }: NamedRouteBreadcrumbItemProps): JSX.Element {
  const matches = useMatches();
  const params = useParams();

  const routeIds = useMemo(() => {
    if (typeof routeId === 'string') {
      return new Set<string>([routeId]);
    } else {
      return new Set<string>(routeId);
    }
  }, [routeId]);

  const match = useMemo(() => matches.find((m) => routeIds.has(m.id)), [matches, routeIds]);

  if (hideUnlessMatch && !match) {
    return <></>;
  }

  return (
    <BreadcrumbItem to={match ? generatePath(match.pathname, params) : '.'} active={match != null}>
      {children}
    </BreadcrumbItem>
  );
}

export default NamedRouteBreadcrumbItem;

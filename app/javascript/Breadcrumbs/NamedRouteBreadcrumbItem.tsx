import { ReactNode, useMemo } from 'react';
import { generatePath, useMatches, useParams } from 'react-router';

import BreadcrumbItem from './BreadcrumbItem';
import { RouteName } from '../AppRouter';

export type NamedRouteBreadcrumbItemProps = {
  routeId: RouteName | RouteName[];
  children: ReactNode;
};

function NamedRouteBreadcrumbItem({ children, routeId }: NamedRouteBreadcrumbItemProps): JSX.Element {
  const matches = useMatches();
  const params = useParams();

  const routeIds = useMemo(() => {
    if (Array.isArray(routeId)) {
      return new Set<string>(routeId);
    } else {
      return new Set<string>([routeId]);
    }
  }, [routeId]);

  const matchIndex = useMemo(() => matches.findLastIndex((m) => routeIds.has(m.id)), [matches, routeIds]);
  const match = matchIndex === -1 ? undefined : matches[matchIndex];

  if (!match) {
    return <></>;
  }

  return (
    <BreadcrumbItem to={generatePath(match?.pathname ?? '.', params)} active={matchIndex === matches.length - 1}>
      {children}
    </BreadcrumbItem>
  );
}

export default NamedRouteBreadcrumbItem;

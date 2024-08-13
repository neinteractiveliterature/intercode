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

  const matchIndex = useMemo(() => matches.findLastIndex((m) => routeIds.has(m.id)), [matches, routeIds]);
  const match = matchIndex === -1 ? undefined : matches[matchIndex];

  if (hideUnlessMatch && !match) {
    return <></>;
  }

  console.log(match);
  console.log(generatePath(match?.pathname ?? '.', params));

  return (
    <BreadcrumbItem to={generatePath(match?.pathname ?? '.', params)} active={matchIndex === matches.length - 1}>
      {children}
    </BreadcrumbItem>
  );
}

export default NamedRouteBreadcrumbItem;

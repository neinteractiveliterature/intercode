import { useMemo } from 'react';
import { Params, useMatches, useParams, generatePath } from 'react-router';
import { RouteName } from './AppRouter';
import isEqual from 'lodash/isEqual';

export function useNamedRouteMatch(routeId: RouteName | RouteName[], params?: Params) {
  const matches = useMatches();
  const currentParams = useParams();
  const mergedParams = useMemo(() => ({ ...currentParams, ...params }), [currentParams, params]);

  const routeIds = useMemo(() => {
    if (Array.isArray(routeId)) {
      return new Set<string>(routeId);
    } else {
      return new Set<string>([routeId]);
    }
  }, [routeId]);

  const matchIndex = useMemo(
    () => matches.findLastIndex((m) => routeIds.has(m.id) && isEqual(m.params, mergedParams)),
    [matches, routeIds, mergedParams],
  );
  const match = matchIndex === -1 ? undefined : matches[matchIndex];
  const route = match;

  const active = matchIndex === matches.length - 1;
  const to = generatePath(route?.pathname ?? '.', mergedParams);

  return { match, active, to };
}

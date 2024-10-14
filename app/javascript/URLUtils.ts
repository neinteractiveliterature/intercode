import { useLocation } from 'react-router';
import isEqual from 'lodash/isEqual';
import fromPairs from 'lodash/fromPairs';

type LocationType = ReturnType<typeof useLocation>;

export function searchParamsEqual(a: URLSearchParams, b: URLSearchParams): boolean {
  return isEqual(fromPairs([...a.entries()]), fromPairs([...b.entries()]));
}

export function locationsEqualWithSearchParamsTransform(
  a: LocationType,
  b: LocationType,
  transform: (params: URLSearchParams) => URLSearchParams,
): boolean {
  if (a.pathname !== b.pathname) {
    return false;
  }

  const aSearch = new URLSearchParams(a.search);
  const bSearch = new URLSearchParams(b.search);
  return searchParamsEqual(transform(aSearch), transform(bSearch));
}

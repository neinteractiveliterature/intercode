import { ReactNode } from 'react';
import { To, useLocation, useResolvedPath } from 'react-router';

import BreadcrumbItem from './BreadcrumbItem';

export type RouteActivatedBreadcrumbItemProps = {
  to: To;
  pattern?: To;
  children: ReactNode;
  hideUnlessMatch?: boolean;
  caseSensitive?: boolean;
  end?: boolean;
};

function RouteActivatedBreadcrumbItem({
  to,
  children,
  pattern,
  hideUnlessMatch,
  caseSensitive,
  end,
}: RouteActivatedBreadcrumbItemProps): React.JSX.Element {
  const location = useLocation();
  const path = useResolvedPath(pattern ?? to);

  let locationPathname = location.pathname;
  let toPathname = path.pathname;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    toPathname = toPathname.toLowerCase();
  }

  const isActive =
    locationPathname === toPathname ||
    (!end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === '/');

  if (hideUnlessMatch && !isActive) {
    return <></>;
  }

  return (
    <BreadcrumbItem to={to} active={!!isActive}>
      {children}
    </BreadcrumbItem>
  );
}

export default RouteActivatedBreadcrumbItem;

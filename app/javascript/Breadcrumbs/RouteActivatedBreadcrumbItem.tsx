import { ReactNode } from 'react';
import { PathPattern } from 'react-router';
import { useMatch } from 'react-router-dom';

import BreadcrumbItem from './BreadcrumbItem';

export type RouteActivatedBreadcrumbItemProps = {
  to: string;
  pattern: string | PathPattern;
  children: ReactNode;
};

function RouteActivatedBreadcrumbItem({ to, children, pattern }: RouteActivatedBreadcrumbItemProps): JSX.Element {
  const match = useMatch(pattern);

  return (
    <BreadcrumbItem to={to} active={!!match}>
      {children}
    </BreadcrumbItem>
  );
}

export default RouteActivatedBreadcrumbItem;

import { ReactNode } from 'react';
import { To } from 'react-router-dom';

import RouteActivatedBreadcrumbItem from './RouteActivatedBreadcrumbItem';

export type LeafBreadcrumbItemProps = {
  path: To;
  children: ReactNode;
};

export default function LeafBreadcrumbItem({ path, children }: LeafBreadcrumbItemProps): JSX.Element {
  return (
    <RouteActivatedBreadcrumbItem to={path} pattern={path} hideUnlessMatch>
      {children}
    </RouteActivatedBreadcrumbItem>
  );
}

import { ReactNode } from 'react';

import RouteActivatedBreadcrumbItem from './RouteActivatedBreadcrumbItem';

export type LeafBreadcrumbItemProps = {
  path: string;
  children: ReactNode;
};

export default function LeafBreadcrumbItem({ path, children }: LeafBreadcrumbItemProps): JSX.Element {
  return (
    <RouteActivatedBreadcrumbItem to="." pattern={path} hideUnlessMatch>
      {children}
    </RouteActivatedBreadcrumbItem>
  );
}

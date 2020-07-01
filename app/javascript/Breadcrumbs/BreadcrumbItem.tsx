import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type BreadcrumbItemProps = {
  active?: boolean,
  children: ReactNode,
  to: string,
};

function BreadcrumbItem({ active, children, to }: BreadcrumbItemProps) {
  if (active) {
    return (
      <li className="breadcrumb-item active">
        {children}
      </li>
    );
  }

  return (
    <li className="breadcrumb-item">
      <Link to={to}>
        {children}
      </Link>
    </li>
  );
}

export default BreadcrumbItem;

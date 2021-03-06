import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type BreadcrumbItemRegularProps = {
  active?: boolean;
  children: ReactNode;
  to: string;
};

type BreadcrumbItemAlwaysActiveProps = {
  active: true;
  children: ReactNode;
};

export type BreadcrumbItemProps = BreadcrumbItemRegularProps | BreadcrumbItemAlwaysActiveProps;

function BreadcrumbItem(props: BreadcrumbItemProps) {
  if (props.active) {
    return <li className="breadcrumb-item active">{props.children}</li>;
  }

  return (
    <li className="breadcrumb-item">
      <Link to={props.to}>{props.children}</Link>
    </li>
  );
}

export default BreadcrumbItem;

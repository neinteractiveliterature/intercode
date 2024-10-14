import { ReactNode } from 'react';
import { Link, To } from 'react-router';

type BreadcrumbItemRegularProps = {
  active?: boolean;
  children: ReactNode;
  to: To;
};

type BreadcrumbItemAlwaysActiveProps = {
  active: true;
  children: ReactNode;
};

export type BreadcrumbItemProps = BreadcrumbItemRegularProps | BreadcrumbItemAlwaysActiveProps;

function BreadcrumbItem(props: BreadcrumbItemProps): JSX.Element {
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

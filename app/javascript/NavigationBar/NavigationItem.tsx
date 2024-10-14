import { ReactNode } from 'react';
import { Link } from 'react-router';

import MenuIcon from './MenuIcon';

export type NavigationItemProps = {
  label: ReactNode;
  url: string;
  inSection: boolean;
  icon?: string;
  iconColorClass?: string;
};

function NavigationItem({ label, url, inSection, icon, iconColorClass }: NavigationItemProps): JSX.Element {
  const labelContent = (
    <>
      <MenuIcon icon={icon || 'bi-file-earmark-text'} colorClass={iconColorClass} />
      {label}
    </>
  );

  if (inSection) {
    return (
      <Link to={url} className="dropdown-item">
        {labelContent}
      </Link>
    );
  }

  return (
    <li className="nav-item">
      <Link to={url} className="nav-link">
        {labelContent}
      </Link>
    </li>
  );
}

export default NavigationItem;

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import MenuIcon from './MenuIcon';

export type NavigationItemProps = {
  label: ReactNode;
  url: string;
  inSection: boolean;
  icon?: string;
  iconColorClass?: string;
};

function NavigationItem({ label, url, inSection, icon, iconColorClass }: NavigationItemProps) {
  const labelContent = (
    <>
      <MenuIcon icon={icon || 'fa-file-text-o'} colorClass={iconColorClass} />
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

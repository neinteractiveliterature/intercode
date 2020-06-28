import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import MenuIcon from './MenuIcon';

function NavigationItem({
  label, url, inSection, icon, iconColorClass,
}) {
  const labelContent = (
    <>
      <MenuIcon icon={icon || 'fa-file-text-o'} colorClass={iconColorClass} />
      {label}
    </>
  );

  if (inSection) {
    return <Link to={url} className="dropdown-item">{labelContent}</Link>;
  }

  return (
    <li className="nav-item">
      <Link to={url} className="nav-link">{labelContent}</Link>
    </li>
  );
}

NavigationItem.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  inSection: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  iconColorClass: PropTypes.string,
};

NavigationItem.defaultProps = {
  icon: null,
  iconColorClass: undefined,
};

export default NavigationItem;

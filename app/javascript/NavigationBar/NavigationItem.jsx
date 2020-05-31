import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import MenuIcon from './MenuIcon';

function NavigationItem({
  label, url, inSection, icon,
}) {
  const labelContent = (
    <>
      <MenuIcon icon={icon || 'fa-file-text-o'} />
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
};

NavigationItem.defaultProps = {
  icon: null,
};

export default NavigationItem;

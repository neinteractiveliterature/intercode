import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavigationItem({ label, url, inSection }) {
  if (inSection) {
    return <Link to={url} className="dropdown-item">{label}</Link>;
  }

  return (
    <li className="nav-item">
      <Link to={url} className="nav-link">{label}</Link>
    </li>
  );
}

NavigationItem.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  inSection: PropTypes.bool.isRequired,
};

export default NavigationItem;

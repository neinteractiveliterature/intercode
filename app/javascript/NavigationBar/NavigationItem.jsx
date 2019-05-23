import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavigationItem({ item, inSection }) {
  if (inSection) {
    return <Link to={item.url} className="dropdown-item">{item.label}</Link>;
  }

  return (
    <li className="nav-item">
      <Link to={item.url} className="nav-link">{item.label}</Link>
    </li>
  );
}

NavigationItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  inSection: PropTypes.bool.isRequired,
};

export default NavigationItem;

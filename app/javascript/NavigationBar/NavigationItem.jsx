import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavigationItem({ item }) {
  return <Link to={item.url} className="dropdown-item">{item.label}</Link>;
}

NavigationItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default NavigationItem;

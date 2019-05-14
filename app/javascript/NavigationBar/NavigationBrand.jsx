import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavigationBrand({ item }) {
  return (
    <Link to="/" className="navbar-brand">{item.label}</Link>
  );
}

NavigationBrand.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default NavigationBrand;

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import NavigationBarContext from './NavigationBarContext';

function NavigationBrand({ item }) {
  const { hideBrand } = useContext(NavigationBarContext);

  return (
    <Link to="/" className={classNames('navbar-brand', { 'd-none': hideBrand })}>{item.label}</Link>
  );
}

NavigationBrand.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default NavigationBrand;

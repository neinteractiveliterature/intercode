import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class NavigationBrand extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
  }

  render = () => (
    <Link to="/" className="navbar-brand">{this.props.item.label}</Link>
  )
}

export default NavigationBrand;

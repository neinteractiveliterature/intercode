import React from 'react';
import PropTypes from 'prop-types';

class NavigationBrand extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
  }

  render = () => (
    <a href="/" className="navbar-brand">{this.props.item.label}</a>
  )
}

export default NavigationBrand;

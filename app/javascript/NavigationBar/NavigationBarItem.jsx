import React from 'react';
import PropTypes from 'prop-types';

import NavigationBrand from './NavigationBrand';
import NavigationCollapse from './NavigationCollapse';

class NavigationBarItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      __typename: PropTypes.string.isRequired,
    }).isRequired,
  };

  render = () => {
    switch (this.props.item.__typename) {
      case 'NavigationBrand':
        return <NavigationBrand item={this.props.item} />;
      case 'NavigationCollapse':
        return <NavigationCollapse item={this.props.item} />;
      default:
        return <code>{this.props.item.__typename}</code>;
    }
  }
}

export default NavigationBarItem;

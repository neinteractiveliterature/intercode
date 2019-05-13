import React from 'react';
import PropTypes from 'prop-types';

import NavigationItem from './NavigationItem';
import NavigationSection from './NavigationSection';
import SignOutNavigationItem from './SignOutNavigationItem';
import TicketPurchaseNavigationItem from './TicketPurchaseNavigationItem';
import UserNavigationSection from './UserNavigationSection';

class RootNavigationGroupItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      __typename: PropTypes.string.isRequired,
    }).isRequired,
  };

  render = () => {
    switch (this.props.item.__typename) {
      case 'NavigationItem':
        return <NavigationItem item={this.props.item} />;
      case 'NavigationSection':
        return <NavigationSection item={this.props.item} />;
      case 'SignOutNavigationItem':
        return <SignOutNavigationItem item={this.props.item} />;
      case 'TicketPurchaseNavigationItem':
        return <TicketPurchaseNavigationItem />;
      case 'UserNavigationSection':
        return <UserNavigationSection item={this.props.item} />;
      default:
        return <code>{this.props.item.__typename}</code>;
    }
  }
}

export default RootNavigationGroupItem;

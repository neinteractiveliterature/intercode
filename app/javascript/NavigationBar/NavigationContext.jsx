import React from 'react';
import PropTypes from 'prop-types';

const NavigationContext = React.createContext({
  convention: null,
  currentPendingOrder: null,
  currentUser: null,
  myProfile: null,
});

export const NavigationConsumer = NavigationContext.Consumer;

export class NavigationProvider extends React.PureComponent {
  static propTypes = {
    assumedIdentityFromProfile: PropTypes.shape({}),
    children: PropTypes.node.isRequired,
    convention: PropTypes.shape({}),
    currentPendingOrder: PropTypes.shape({}),
    currentUser: PropTypes.shape({}),
    myProfile: PropTypes.shape({}),
  }

  static defaultProps = {
    assumedIdentityFromProfile: null,
    convention: null,
    currentPendingOrder: null,
    currentUser: null,
    myProfile: null,
  }

  render = () => (
    <NavigationContext.Provider
      value={{
        assumedIdentityFromProfile: this.props.assumedIdentityFromProfile,
        convention: this.props.convention,
        currentPendingOrder: this.props.currentPendingOrder,
        currentUser: this.props.currentUser,
        myProfile: this.props.myProfile,
      }}
    >
      {this.props.children}
    </NavigationContext.Provider>
  )
}

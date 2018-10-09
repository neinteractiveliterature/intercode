import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import NavigationBarItem from './NavigationBarItem';
import { NavigationProvider } from './NavigationContext';

class NavigationBar extends React.PureComponent {
  static propTypes = {
    assumedIdentityFromProfile: PropTypes.shape({}),
    convention: PropTypes.shape({}),
    currentPendingOrder: PropTypes.shape({}),
    currentUser: PropTypes.shape({}),
    myProfile: PropTypes.shape({}),
    navigationBar: PropTypes.shape({
      classes: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
  }

  static defaultProps = {
    assumedIdentityFromProfile: null,
    convention: null,
    currentPendingOrder: null,
    currentUser: null,
    myProfile: null,
  }

  render = () => (
    <NavigationProvider
      assumedIdentityFromProfile={this.props.assumedIdentityFromProfile}
      convention={this.props.convention}
      currentPendingOrder={this.props.currentPendingOrder}
      currentUser={this.props.currentUser}
      myProfile={this.props.myProfile}
    >
      <nav className={classNames('navbar navbar-fixed-top navbar-expand-md mb-4', this.props.navigationBar.classes)} role="navigation">
        <div className="container">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          {this.props.navigationBar.items.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <NavigationBarItem key={i} item={item} />
          ))}
        </div>
      </nav>
    </NavigationProvider>
  )
}

export default NavigationBar;

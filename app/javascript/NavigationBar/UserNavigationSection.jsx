import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import htmlFetch from './htmlFetch';
import { NavigationConsumer } from './NavigationContext';
import PopperDropdown from '../UIComponents/PopperDropdown';
import RootNavigationGroupItem from './RootNavigationGroupItem';
import SignInButton from '../Authentication/SignInButton';
import SignUpButton from '../Authentication/SignUpButton';

class UserNavigationSection extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
  }

  revertAssumedIdentity = async () => {
    const response = await htmlFetch('/user_con_profiles/revert_become', {
      method: 'POST',
    });

    window.location.href = response.url;
  }

  renderCurrentPendingOrderButton = (currentPendingOrder) => {
    if (!currentPendingOrder) {
      return null;
    }

    const totalQuantity = currentPendingOrder.order_entries.reduce(
      (total, entry) => total + entry.quantity,
      0,
    );
    if (totalQuantity < 1) {
      return null;
    }

    return (
      <li className="nav-item">
        <Link to="/cart" className="btn btn-light mr-2" style={{ position: 'relative' }}>
          <i className="fa fa-shopping-cart" title="My shopping cart" />
          <badge className="badge-pill badge-danger" style={{ position: 'absolute', right: '-9px', top: '-9px' }}>
            {totalQuantity}
          </badge>
        </Link>
      </li>
    );
  }

  renderLoggedInDropdownTarget = ({
    ref, toggle, currentUser, myProfile, assumedIdentityFromProfile,
  }) => {
    if (assumedIdentityFromProfile) {
      return (
        <button className="btn btn-warning dropdown-toggle" onClick={toggle} ref={ref} type="button">
          <i className="fa fa-user-secret" />
          {' '}
          <span className="d-inline d-md-none d-lg-inline">
            {myProfile.name_without_nickname}
          </span>
          <span className="d-none d-md-inline d-lg-none">
            {myProfile.first_name[0]}
            {myProfile.last_name[0]}
          </span>
        </button>
      );
    }

    return (
      <button className="btn btn-link nav-link dropdown-toggle" onClick={toggle} ref={ref} type="button">
        <i className="fa fa-user" />
        {' '}
        {
          myProfile
            ? myProfile.name
            : currentUser.name
        }
      </button>
    );
  }

  renderRevertAssumedIdentityButton = (assumedIdentityFromProfile) => {
    if (!assumedIdentityFromProfile) {
      return null;
    }

    return (
      <button className="btn btn-secondary" onClick={this.revertAssumedIdentity} type="button">
        Revert
        <span className="d-inline d-md-none d-lg-inline">
          {' '}
          to
          {' '}
          {assumedIdentityFromProfile.name_without_nickname}
        </span>
      </button>
    );
  }

  renderLoggedInContent = ({
    currentPendingOrder, currentUser, myProfile, assumedIdentityFromProfile,
  }) => (
    <React.Fragment>
      {this.renderCurrentPendingOrderButton(currentPendingOrder)}
      <li className="nav-item">
        <div className="btn-group" role="group">
          <div className="btn-group" role="group">
            <PopperDropdown
              renderReference={({ ref, toggle }) => this.renderLoggedInDropdownTarget({
                ref,
                toggle,
                currentUser,
                myProfile,
                assumedIdentityFromProfile,
              })}
              style={{ zIndex: 1100 }}
            >
              {this.props.item.items.map((item, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <RootNavigationGroupItem item={item} key={i} />
              ))}
            </PopperDropdown>
          </div>
          {this.renderRevertAssumedIdentityButton(assumedIdentityFromProfile)}
        </div>
      </li>
    </React.Fragment>
  )

  renderLoggedOutContent = () => (
    <React.Fragment>
      <li className="nav-item login my-auto">
        <SignInButton className="btn btn-link nav-link" caption="Log in" />
      </li>
      <li className="nav-item my-auto">
        <SignUpButton className="btn btn-primary nav-link py-1 text-white">Sign up</SignUpButton>
      </li>
    </React.Fragment>
  )

  render = () => (
    <NavigationConsumer>
      {({
        assumedIdentityFromProfile, currentPendingOrder, currentUser, myProfile,
      }) => (
        currentUser
          ? this.renderLoggedInContent({
            assumedIdentityFromProfile, currentPendingOrder, currentUser, myProfile,
          })
          : this.renderLoggedOutContent()
      )}
    </NavigationConsumer>
  )
}

export default UserNavigationSection;

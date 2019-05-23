import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import htmlFetch from './htmlFetch';
import { NavigationBarQuery } from './queries.gql';
import PopperDropdown from '../UIComponents/PopperDropdown';
import SignInButton from '../Authentication/SignInButton';
import SignUpButton from '../Authentication/SignUpButton';
import useQuerySuspended from '../useQuerySuspended';
import useAutoClosingDropdownRef from './useAutoClosingDropdownRef';

function CurrentPendingOrderButton() {
  const { data, error } = useQuerySuspended(NavigationBarQuery);

  if (error) {
    return null;
  }

  const { currentPendingOrder } = data;

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
        <div className="badge badge-pill badge-danger" style={{ position: 'absolute', right: '-9px', top: '-9px' }}>
          {totalQuantity}
        </div>
      </Link>
    </li>
  );
}

// eslint-disable-next-line react/prop-types
function LoggedInDropdownTarget({ toggle }, ref) {
  const { data, error } = useQuerySuspended(NavigationBarQuery);

  if (error) {
    return null;
  }

  const { currentUser, myProfile, assumedIdentityFromProfile } = data;

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

const RefForwardingLoggedInDropdownTarget = forwardRef(LoggedInDropdownTarget);

function RevertAssumedIdentityButton() {
  const { data, error } = useQuerySuspended(NavigationBarQuery);

  if (error) {
    return null;
  }

  const revertAssumedIdentity = async () => {
    const response = await htmlFetch('/user_con_profiles/revert_become', {
      method: 'POST',
    });

    window.location.href = response.url;
  };

  const { assumedIdentityFromProfile } = data;

  if (!assumedIdentityFromProfile) {
    return null;
  }

  return (
    <button className="btn btn-secondary" onClick={revertAssumedIdentity} type="button">
      Revert
      <span className="d-inline d-md-none d-lg-inline">
        {' to '}
        {assumedIdentityFromProfile.name_without_nickname}
      </span>
    </button>
  );
}

function UserNavigationSection({ item, location, renderNavigationItems }) {
  const { data, error } = useQuerySuspended(NavigationBarQuery);
  const dropdownRef = useAutoClosingDropdownRef(location);

  if (error) {
    return null;
  }

  const renderLoggedInContent = () => (
    <>
      <CurrentPendingOrderButton />
      <li className="nav-item">
        <div className="btn-group" role="group">
          <div className="btn-group" role="group">
            <PopperDropdown
              ref={dropdownRef}
              renderReference={({ ref, toggle }) => (
                <RefForwardingLoggedInDropdownTarget ref={ref} toggle={toggle} />
              )}
              placement="bottom-end"
              style={{ zIndex: 1100 }}
            >
              {renderNavigationItems(item.items, true)}
            </PopperDropdown>
          </div>
          <RevertAssumedIdentityButton />
        </div>
      </li>
    </>
  );

  const renderLoggedOutContent = () => (
    <>
      <li className="nav-item login my-auto">
        <SignInButton className="btn btn-link nav-link" caption="Log in" />
      </li>
      <li className="nav-item my-auto">
        <SignUpButton className="btn btn-primary nav-link py-1 text-white">Sign up</SignUpButton>
      </li>
    </>
  );

  return data.currentUser ? renderLoggedInContent() : renderLoggedOutContent();
}

UserNavigationSection.propTypes = {
  item: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  renderNavigationItems: PropTypes.func.isRequired,
};

export default withRouter(UserNavigationSection);

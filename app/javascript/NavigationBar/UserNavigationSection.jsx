import React, { forwardRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import htmlFetch from './htmlFetch';
import PopperDropdown from '../UIComponents/PopperDropdown';
import SignInButton from '../Authentication/SignInButton';
import SignUpButton from '../Authentication/SignUpButton';
import useAutoClosingDropdownRef from './useAutoClosingDropdownRef';
import AppRootContext from '../AppRootContext';
import NavigationItem from './NavigationItem';
import Gravatar from '../Gravatar';
import CartContents from '../Store/CartContents';
import MenuIcon from './MenuIcon';
import SignOutButton from '../Authentication/SignOutButton';

function CurrentPendingOrderButton() {
  const { t } = useTranslation();
  const { currentPendingOrder } = useContext(AppRootContext);
  const dropdownRef = useAutoClosingDropdownRef();

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
      <PopperDropdown
        ref={dropdownRef}
        renderReference={({ ref, toggle }) => (
          <button
            ref={ref}
            onClick={toggle}
            type="button"
            className="btn btn-link nav-link mr-2"
            style={{ position: 'relative' }}
          >
            <i
              className="fa fa-shopping-cart"
              title={t('navigation.myShoppingCart.buttonText', 'My shopping cart')}
            />
            <div className="badge badge-pill badge-danger" style={{ position: 'absolute', right: '-7px', top: '0' }}>
              {totalQuantity}
            </div>
          </button>
        )}
        placement="bottom-end"
        style={{ zIndex: 1100 }}
      >
        <div className="px-3 pt-3">
          <h4 className="mb-2">{t('navigation.myShoppingCart.buttonText', 'My shopping cart')}</h4>
          <CartContents
            checkOutButton={(
              <Link className="btn btn-primary mt-2" to="/cart">
                {t('navigation.myShoppingCart.goToCart', 'Go to cart')}
              </Link>
            )}
          />
        </div>
      </PopperDropdown>
    </li>
  );
}

// eslint-disable-next-line react/prop-types
function LoggedInDropdownTarget({ toggle, visible }, ref) {
  const { t } = useTranslation();
  const { currentUser, myProfile, assumedIdentityFromProfile } = useContext(AppRootContext);

  if (!currentUser) {
    // this can happen in the middle of a resetStore
    return null;
  }

  if (assumedIdentityFromProfile) {
    return (
      <button className="btn btn-warning dropdown-toggle" onClick={toggle} ref={ref} type="button">
        <i className="fa fa-user-secret" />

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
    <button
      className="btn btn-link nav-link"
      onClick={toggle}
      ref={ref}
      type="button"
      aria-label={t('navigation.headers.user', 'User options')}
    >
      <Gravatar
        url={(myProfile || {}).gravatar_url}
        enabled={(myProfile || {}).gravatar_enabled || false}
        pixelSize={(myProfile || {}).gravatar_enabled ? 24 : 16}
        imgClassName={visible ? 'glow-light' : ''}
      />
    </button>
  );
}

const RefForwardingLoggedInDropdownTarget = forwardRef(LoggedInDropdownTarget);

function RevertAssumedIdentityButton() {
  const { assumedIdentityFromProfile } = useContext(AppRootContext);

  const revertAssumedIdentity = async () => {
    const response = await htmlFetch('/user_con_profiles/revert_become', {
      method: 'POST',
    });

    window.location.href = response.url;
  };

  if (!assumedIdentityFromProfile) {
    return null;
  }

  return (
    <button className="btn btn-secondary" onClick={revertAssumedIdentity} type="button">
      <Trans
        i18nKey="navigation.assumedIdentity.revert"
        values={{ name: assumedIdentityFromProfile.name_without_nickname }}
      >
        Revert
        <span className="d-inline d-md-none d-lg-inline">
          {' to {{ name }}'}
        </span>
      </Trans>
    </button>
  );
}

function UserNavigationSection() {
  const { t } = useTranslation();
  const { conventionName, currentUser, myProfile } = useContext(AppRootContext);
  const dropdownRef = useAutoClosingDropdownRef();

  const renderLoggedInContent = () => (
    <>
      <CurrentPendingOrderButton />
      <li className="nav-item">
        <div className="btn-group" role="group">
          <div className="btn-group" role="group">
            <PopperDropdown
              ref={dropdownRef}
              renderReference={({ ref, toggle, visible }) => (
                <RefForwardingLoggedInDropdownTarget ref={ref} toggle={toggle} visible={visible} />
              )}
              placement="bottom-end"
              style={{ zIndex: 1100 }}
            >
              {currentUser && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.myAccount', 'My Account')}
                  url="/users/edit"
                  icon="fa-address-card"
                />
              )}
              {myProfile && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.myProfile', 'My {{ conventionName }} Profile', { conventionName })}
                  url="/my_profile"
                  icon="fa-user-circle"
                />
              )}
              {myProfile && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.myOrderHistory', 'My Order History')}
                  url="/order_history"
                  icon="fa-shopping-bag"
                />
              )}
              {currentUser && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.authorizedApplications', 'Authorized Applications')}
                  url="/oauth/authorized_applications"
                  icon="fa-lock"
                />
              )}
              {currentUser && (
                <SignOutButton
                  className="dropdown-item"
                  caption={(
                    <>
                      <MenuIcon icon="fa-sign-out" />
                      {t('navigation.user.logOut', 'Log out')}
                    </>
                  )}
                />
              )}
            </PopperDropdown>
          </div>
          <RevertAssumedIdentityButton />
        </div>
      </li>
    </>
  );

  const renderLoggedOutContent = () => (
    <>
      <PopperDropdown
        ref={dropdownRef}
        renderReference={({ ref, toggle }) => (
          <button className="btn btn-link nav-link" onClick={toggle} ref={ref} type="button">
            <i className="fa fa-user-circle" />
            <span className="sr-only">
              {t('navigation.headers.authentication', 'Log in or sign up')}
            </span>
          </button>
        )}
        placement="bottom-end"
        style={{ zIndex: 1100 }}
      >
        <li className="nav-item login my-auto">
          <SignInButton
            className="btn btn-link dropdown-item"
            caption={(
              <>
                <MenuIcon icon="fa-sign-in" />
                {t('navigation.authentication.logIn', 'Log in')}
              </>
           )}
          />
        </li>
        <li className="nav-item my-auto">
          <SignUpButton
            className="btn btn-link dropdown-item"
            caption={(
              <>
                <MenuIcon icon="fa-pencil-square-o" />
                {t('navigation.authentication.signUp', 'Sign up')}
              </>
            )}
          />
        </li>
      </PopperDropdown>
    </>
  );

  return currentUser ? renderLoggedInContent() : renderLoggedOutContent();
}

export default UserNavigationSection;

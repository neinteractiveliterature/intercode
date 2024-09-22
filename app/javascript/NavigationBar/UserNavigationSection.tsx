import { forwardRef, useContext, useState } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import classNames from 'classnames';
import { useLitformPopperWithAutoClosing, useToggleOpen } from '@neinteractiveliterature/litform';

import htmlFetch from './htmlFetch';
import SignInButton from '../Authentication/SignInButton';
import SignUpButton from '../Authentication/SignUpButton';
import AppRootContext from '../AppRootContext';
import NavigationItem from './NavigationItem';
import Gravatar from '../Gravatar';
import CartContents from 'Store/Cart/CartContents';
import MenuIcon from './MenuIcon';
import SignOutButton from '../Authentication/SignOutButton';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import useAutoCloseOnNavigate from './useAutoCloseOnNavigate';

function CurrentPendingOrderButton() {
  const { t } = useTranslation();
  const { currentPendingOrder } = useContext(AppRootContext);

  if (!currentPendingOrder) {
    return null;
  }

  const totalQuantity = currentPendingOrder.order_entries.reduce((total, entry) => total + entry.quantity, 0);
  if (totalQuantity < 1) {
    return null;
  }

  return (
    <li className="nav-item">
      <DropdownMenu
        buttonClassName="btn btn-link nav-link me-2"
        buttonStyle={{ zIndex: 1100, position: 'relative' }}
        popperOptions={{ placement: 'bottom-end' }}
        buttonContent={
          <>
            <i className="bi-cart-fill" title={t('navigation.myShoppingCart.buttonText')} />
            <div className="badge rounded-pill bg-danger" style={{ position: 'absolute', right: '-7px', top: '0' }}>
              {totalQuantity}
            </div>
          </>
        }
        dropdownStyle={{ zIndex: 1100 }}
      >
        <div className="px-3 pt-3">
          <h4 className="mb-2">{t('navigation.myShoppingCart.buttonText')}</h4>
          <CartContents
            checkOutButton={
              <Link className="btn btn-primary mt-2" to="/cart">
                {t('navigation.myShoppingCart.goToCart')}
              </Link>
            }
          />
        </div>
      </DropdownMenu>
    </li>
  );
}

type LoggedInDropdownTargetProps = {
  toggle: (event: React.BaseSyntheticEvent) => void;
  visible: boolean;
};

const LoggedInDropdownTarget = forwardRef<HTMLButtonElement, LoggedInDropdownTargetProps>(
  function LoggedInDropdownTarget({ toggle, visible }, ref) {
    const { t } = useTranslation();
    const { currentUser, myProfile, assumedIdentityFromProfile } = useContext(AppRootContext);

    if (!currentUser) {
      // this can happen in the middle of a resetStore
      return <></>;
    }

    if (assumedIdentityFromProfile) {
      return (
        <button className="btn btn-warning dropdown-toggle" onClick={toggle} ref={ref} type="button">
          <i className="bi-person-bounding-box" />{' '}
          <span className="d-inline d-md-none d-lg-inline">{myProfile?.name_without_nickname}</span>
          <span className="d-none d-md-inline d-lg-none">
            {(myProfile?.first_name ?? '')[0]}
            {(myProfile?.last_name ?? '')[0]}
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
        aria-label={t('navigation.headers.user')}
      >
        <Gravatar
          url={(myProfile || {}).gravatar_url}
          enabled={(myProfile || {}).gravatar_enabled || false}
          pixelSize={(myProfile || {}).gravatar_enabled ? 24 : 16}
          imgClassName={visible ? 'glow-light' : ''}
        />
      </button>
    );
  },
);

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
        <span className="d-inline d-md-none d-lg-inline">{' to {{ name }}'}</span>
      </Trans>
    </button>
  );
}

function UserNavigationSection(): JSX.Element {
  const { t } = useTranslation();
  const { conventionName, currentUser, myProfile, hasOAuthApplications } = useContext(AppRootContext);

  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const { styles, attributes, update } = useLitformPopperWithAutoClosing(
    dropdownMenu,
    referenceElement,
    undefined,
    setDropdownOpen,
    {
      modifiers: [{ name: 'offset', options: { offset: [0, 2] } }],
      placement: 'bottom-end',
    },
  );

  const toggle = useToggleOpen(setDropdownOpen, update);
  useAutoCloseOnNavigate(setDropdownOpen);

  const renderLoggedInContent = () => (
    <>
      <CurrentPendingOrderButton />
      <li className="nav-item">
        <div className="btn-group" role="group">
          <div className="btn-group" role="group">
            <LoggedInDropdownTarget ref={setReferenceElement} toggle={toggle} visible={dropdownOpen} />
            <div
              className={classNames('dropdown-menu m-0', { show: dropdownOpen })}
              ref={setDropdownMenu}
              style={{
                zIndex: 1100,
                ...styles.popper,
              }}
              {...attributes.popper}
            >
              {currentUser && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.myAccount')}
                  url="/users/edit"
                  icon="bi-card-heading"
                />
              )}
              {myProfile && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.myProfile', {
                    conventionName,
                  })}
                  url="/my_profile"
                  icon="bi-person-circle"
                />
              )}
              {myProfile && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.myOrderHistory')}
                  url="/order_history"
                  icon="bi-bag-fill"
                />
              )}
              {currentUser && hasOAuthApplications && (
                <NavigationItem
                  inSection
                  label={t('navigation.user.authorizedApplications')}
                  url="/oauth/authorized_applications"
                  icon="bi-lock-fill"
                />
              )}
              {currentUser && (
                <SignOutButton
                  className="dropdown-item"
                  caption={
                    <>
                      <MenuIcon icon="bi-box-arrow-right" />
                      {t('navigation.user.logOut')}
                    </>
                  }
                />
              )}
            </div>
          </div>
          <RevertAssumedIdentityButton />
        </div>
      </li>
    </>
  );

  const renderLoggedOutContent = () => (
    <>
      <button className="btn btn-primary" onClick={toggle} ref={setReferenceElement} type="button">
        {t('navigation.headers.authentication')}
      </button>
      <div
        className={classNames('dropdown-menu m-0', { show: dropdownOpen })}
        ref={setDropdownMenu}
        style={{
          zIndex: 1100,
          ...styles.popper,
        }}
        {...attributes.popper}
      >
        <li className="nav-item login my-auto">
          <SignInButton
            className="btn btn-link dropdown-item"
            caption={
              <>
                <MenuIcon icon="bi-box-arrow-in-right" />
                {t('navigation.authentication.logIn')}
              </>
            }
          />
        </li>
        <li className="nav-item my-auto">
          <SignUpButton
            className="btn btn-link dropdown-item"
            caption={
              <>
                <MenuIcon icon="bi-pencil-square" />
                {t('navigation.authentication.signUp')}
              </>
            }
          />
        </li>
      </div>
    </>
  );

  return currentUser ? renderLoggedInContent() : renderLoggedOutContent();
}

export default UserNavigationSection;

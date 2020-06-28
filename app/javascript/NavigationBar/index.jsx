import React, {
  useContext, useMemo, useRef, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sortBy from 'lodash/sortBy';
import { useLocation } from 'react-router-dom';

import AppRootContext from '../AppRootContext';
import NavigationBrand from './NavigationBrand';
import UserNavigationSection from './UserNavigationSection';
import TicketPurchaseNavigationItem from './TicketPurchaseNavigationItem';
import NavigationItem from './NavigationItem';
import NavigationSection from './NavigationSection';
import useCollapse from './useCollapse';
import EventsNavigationSection from './EventsNavigationSection';
import AdminNavigationSection from './AdminNavigationSection';
import SearchNavigationItem from './SearchNavigationItem';
import NavigationBarContext from './NavigationBarContext';

function NavigationBarContent({ navbarClasses, rootItems }) {
  const location = useLocation();
  const {
    conventionName, conventionCanceled, rootSiteName, siteMode, ticketsAvailableForPurchase,
  } = useContext(AppRootContext);
  const collapseRef = useRef();
  const {
    collapsed, collapseProps, setCollapsed, toggleCollapsed,
  } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const [hideBrand, setHideBrand] = useState(false);
  const [hideNavItems, setHideNavItems] = useState(false);

  useEffect(
    () => {
      setCollapsed(true);
    },
    [location.pathname, setCollapsed],
  );

  return (
    <NavigationBarContext.Provider
      value={{
        setHideBrand, hideBrand, setHideNavItems, hideNavItems,
      }}
    >
      <nav className={classNames('navbar', 'd-block', navbarClasses, { 'pb-0': conventionCanceled })} role="navigation">
        <div className="container">
          <NavigationBrand item={{ label: conventionName || rootSiteName }} />
          <div
            id="navbarSupportedContent"
            className={classNames('navbar-collapse', 'flex-grow-0', collapseClassName)}
            ref={collapseRef}
            {...otherCollapseProps}
          >
            <ul className={classNames('navbar-nav', { 'd-md-none': hideNavItems })}>
              {ticketsAvailableForPurchase && siteMode !== 'single_event' && (
                <TicketPurchaseNavigationItem />
              )}
              {conventionName && siteMode !== 'single_event' && (
                <EventsNavigationSection />
              )}
              {rootItems.map((rootItem) => {
                if (rootItem.sectionItems && rootItem.sectionItems.length > 0) {
                  return (
                    <NavigationSection label={rootItem.title} key={rootItem.id}>
                      {rootItem.sectionItems.map((sectionItem) => (
                        <NavigationItem
                          label={sectionItem.title}
                          url={`/pages/${sectionItem.page.slug}`}
                          key={sectionItem.id}
                          inSection
                        />
                      ))}
                    </NavigationSection>
                  );
                }

                return (
                  <NavigationItem
                    label={rootItem.title}
                    url={`/pages/${rootItem.page.slug}`}
                    key={rootItem.id}
                    iconColorClass="" /* don't override the nav-link color in the root bar */
                  />
                );
              })}
              <AdminNavigationSection />
            </ul>
          </div>
          <SearchNavigationItem />
          <ul className="navbar-nav">
            <UserNavigationSection />
          </ul>
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={toggleCollapsed}
            aria-controls="navbarSupportedContent"
            aria-expanded={!collapsed}
            aria-label="Toggle navigation"
          >
            <i className={collapsed ? 'fa fa-bars' : 'fa fa-times'} />
          </button>
        </div>
        {conventionCanceled && (
          <div className="navbar-convention-canceled-notice">
            <div className="container">
              <div className="text-center flex-grow-1">
                {conventionName}
                {' '}
                is canceled.
              </div>
            </div>
          </div>
        )}
      </nav>
    </NavigationBarContext.Provider>
  );
}

NavigationBarContent.propTypes = {
  navbarClasses: PropTypes.string.isRequired,
  rootItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const MemoizedNavigationBarContent = React.memo(NavigationBarContent);

function NavigationBar({ navbarClasses }) {
  const { cmsNavigationItems } = useContext(AppRootContext);

  const rootNavigationItems = useMemo(
    () => {
      const rootItems = sortBy(
        cmsNavigationItems.filter((item) => item.navigation_section == null),
        (item) => item.position,
      );

      return rootItems.map((rootItem) => {
        const sectionItems = sortBy(
          cmsNavigationItems.filter(
            (item) => item.navigation_section && item.navigation_section.id === rootItem.id,
          ),
          (item) => item.position,
        );

        return { ...rootItem, sectionItems };
      });
    },
    [cmsNavigationItems],
  );

  return (
    <MemoizedNavigationBarContent
      rootItems={rootNavigationItems}
      navbarClasses={navbarClasses}
    />
  );
}

NavigationBar.propTypes = {
  navbarClasses: PropTypes.string,
};

NavigationBar.defaultProps = {
  navbarClasses: null,
};

export default NavigationBar;

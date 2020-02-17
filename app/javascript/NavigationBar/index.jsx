import React, {
  useContext, useMemo, useRef, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sortBy from 'lodash-es/sortBy';
import { withRouter } from 'react-router-dom';

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

function NavigationBarContent({ navbarClasses, rootItems, location }) {
  const {
    conventionName, rootSiteName, siteMode, ticketsAvailableForPurchase,
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
      <nav className={classNames('navbar', navbarClasses)} role="navigation">
        <div className="container">
          <NavigationBrand item={{ label: conventionName || rootSiteName }} />
          {!hideNavItems && (
            <div
              id="navbarSupportedContent"
              className={classNames('navbar-collapse', collapseClassName)}
              ref={collapseRef}
              {...otherCollapseProps}
            >
              <ul className="navbar-nav">
                {ticketsAvailableForPurchase && siteMode !== 'single_event' && (
                  <TicketPurchaseNavigationItem />
                )}
                {conventionName && siteMode !== 'single_event' && (
                  <EventsNavigationSection />
                )}
                {rootItems.map((rootItem) => {
                  if (rootItem.sectionItems) {
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

                  return <NavigationItem label={rootItem.title} url={`/pages/${rootItem.page.slug}`} key={rootItem.id} />;
                })}
                <AdminNavigationSection />
              </ul>
            </div>
          )}
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
      </nav>
    </NavigationBarContext.Provider>
  );
}

NavigationBarContent.propTypes = {
  navbarClasses: PropTypes.string.isRequired,
  rootItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

const MemoizedNavigationBarContent = withRouter(React.memo(NavigationBarContent));

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

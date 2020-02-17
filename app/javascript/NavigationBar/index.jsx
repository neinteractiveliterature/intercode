import React, {
  useContext, useMemo, useRef, useEffect,
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

function NavigationBarContent({ navbarClasses, rootItems, location }) {
  const {
    conventionName, rootSiteName, siteMode, ticketsAvailableForPurchase,
  } = useContext(AppRootContext);
  const collapseRef = useRef();
  const {
    collapsed, collapseProps, setCollapsed, toggleCollapsed,
  } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;

  useEffect(
    () => {
      setCollapsed(true);
    },
    [location.pathname, setCollapsed],
  );

  return (
    <nav className={classNames('navbar', navbarClasses)} role="navigation">
      <div className="container">
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          onClick={toggleCollapsed}
          aria-controls="navbarSupportedContent"
          aria-expanded={!collapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <NavigationBrand item={{ label: conventionName || rootSiteName }} />
        <div
          id="navbarSupportedContent"
          className={classNames('navbar-collapse', collapseClassName)}
          ref={collapseRef}
          {...otherCollapseProps}
        >
          <ul className="navbar-nav mr-auto">
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
          <ul className="navbar-nav">
            <UserNavigationSection />
          </ul>
        </div>
      </div>
    </nav>
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

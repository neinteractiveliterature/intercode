import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useQuery } from 'react-apollo-hooks';
import sortBy from 'lodash-es/sortBy';

import { NavigationBarQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import renderNavigationItems from './renderNavigationItems';
import AppRootContext from '../AppRootContext';
import NavigationBrand from './NavigationBrand';
import UserNavigationSection from './UserNavigationSection';

function NavigationBarContent({ navbarClasses, items }) {
  const { conventionName, rootSiteName } = useContext(AppRootContext);

  return (
    <nav className={classNames('navbar', navbarClasses)} role="navigation">
      <div className="container">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <NavigationBrand item={{ label: conventionName || rootSiteName }} />
        <div id="navbarSupportedContent" className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            {renderNavigationItems(items, false)}
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
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const MemoizedNavigationBarContent = React.memo(NavigationBarContent);

function NavigationBar({ navbarClasses }) {
  const { cmsNavigationItems } = useContext(AppRootContext);
  const { data, loading, error } = useQuery(NavigationBarQuery);

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

  if (loading) {
    return (
      <nav className={classNames('navbar', navbarClasses)} role="navigation">
        <div className="container">
          <div className="navbar-brand">&nbsp;</div>
        </div>
      </nav>
    );
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data.navigationBar) {
    return null;
  }

  return (
    <MemoizedNavigationBarContent
      rootItems={rootNavigationItems}
      items={data.navigationBar.items}
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

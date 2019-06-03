import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useQuery } from 'react-apollo-hooks';

import { NavigationBarQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import renderNavigationItems from './renderNavigationItems';

function NavigationBarContent({ navbarClasses, items }) {
  return (
    <nav className={classNames('navbar', navbarClasses)} role="navigation">
      <div className="container">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        {renderNavigationItems(items, false)}
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
  const { data, loading, error } = useQuery(NavigationBarQuery);

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
    <MemoizedNavigationBarContent items={data.navigationBar.items} navbarClasses={navbarClasses} />
  );
}

NavigationBar.propTypes = {
  navbarClasses: PropTypes.string,
};

NavigationBar.defaultProps = {
  navbarClasses: null,
};

export default NavigationBar;

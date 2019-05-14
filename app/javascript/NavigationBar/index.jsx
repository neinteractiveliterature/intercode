import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useQuery } from 'react-apollo-hooks';

import { NavigationBarQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import renderNavigationItems from './renderNavigationItems';

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

  return (
    <nav className={classNames('navbar', data.navigationBar.classes)} role="navigation">
      <div className="container">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        {renderNavigationItems(data.navigationBar.items)}
      </div>
    </nav>
  );
}

NavigationBar.propTypes = {
  navbarClasses: PropTypes.string,
};

NavigationBar.defaultProps = {
  navbarClasses: null,
};

export default NavigationBar;

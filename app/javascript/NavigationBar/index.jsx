import React from 'react';
import classNames from 'classnames';
import { useQuery } from 'react-apollo-hooks';

import { NavigationBarQuery } from './queries.gql';
import { NavigationProvider } from './NavigationContext';
import ErrorDisplay from '../ErrorDisplay';
import renderNavigationItems from './renderNavigationItems';

function NavigationBar() {
  const { data, loading, error } = useQuery(NavigationBarQuery);

  if (loading) {
    return <></>;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <NavigationProvider
      assumedIdentityFromProfile={data.assumedIdentityFromProfile}
      convention={data.convention}
      currentPendingOrder={data.currentPendingOrder}
      currentUser={data.currentUser}
      myProfile={data.myProfile}
    >
      <nav className={classNames('navbar navbar-fixed-top navbar-expand-md mb-4', data.navigationBar.classes)} role="navigation">
        <div className="container">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          {renderNavigationItems(data.navigationBar.items)}
        </div>
      </nav>
    </NavigationProvider>
  );
}

export default NavigationBar;

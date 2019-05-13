import React from 'react';
import classNames from 'classnames';

import { NavigationBarQuery } from './queries.gql';
import NavigationBarItem from './NavigationBarItem';
import { NavigationProvider } from './NavigationContext';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';

function NavigationBar() {
  const { data, error } = useQuerySuspended(NavigationBarQuery);

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
          {data.navigationBar.items.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <NavigationBarItem key={i} item={item} />
          ))}
        </div>
      </nav>
    </NavigationProvider>
  );
}

export default NavigationBar;

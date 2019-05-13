import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPage from './CmsPage';

function AppRouter() {
  return (
    <Switch>
      <Route
        path="/pages/:slug([a-zA-Z0-9\-/]+)"
        render={routeProps => (
          <CmsPage {...routeProps} slug={routeProps.match.params.slug} />
        )}
      />
      <Route
        path="/"
        exact
        render={routeProps => (
          <CmsPage {...routeProps} rootPage />
        )}
      />
    </Switch>
  );
}

export default AppRouter;

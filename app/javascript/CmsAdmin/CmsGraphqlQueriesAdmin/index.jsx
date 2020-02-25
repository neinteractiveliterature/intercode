import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsGraphqlQueriesAdminTable from './CmsGraphqlQueriesAdminTable';
import EditCmsGraphqlQuery from './EditCmsGraphqlQuery';
import NewCmsGraphqlQuery from './NewCmsGraphqlQuery';
import ViewCmsGraphqlQuerySource from './ViewCmsGraphqlQuerySource';

function CmsGraphqlQueriesAdmin() {
  return (
    <Switch>
      <Route path="/cms_graphql_queries/:id/edit"><EditCmsGraphqlQuery /></Route>
      <Route path="/cms_graphql_queries/:id/view_source"><ViewCmsGraphqlQuerySource /></Route>
      <Route path="/cms_graphql_queries/new"><NewCmsGraphqlQuery /></Route>
      <Route path="/cms_graphql_queries"><CmsGraphqlQueriesAdminTable /></Route>
    </Switch>
  );
}

export default CmsGraphqlQueriesAdmin;

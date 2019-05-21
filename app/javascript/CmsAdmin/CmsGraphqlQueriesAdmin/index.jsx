import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsGraphqlQueriesAdminTable from './CmsGraphqlQueriesAdminTable';
import { CmsGraphqlQueriesQuery } from './queries.gql';
import EditCmsGraphqlQuery from './EditCmsGraphqlQuery';
import NewCmsGraphqlQuery from './NewCmsGraphqlQuery';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';

function CmsGraphqlQueriesAdmin() {
  return (
    <Switch>
      <Route path="/cms_graphql_queries/new" component={NewCmsGraphqlQuery} />
      <Route
        path="/cms_graphql_queries/:id/edit"
        render={({ match: { params: { id } }, history }) => (
          <QueryWithStateDisplay query={CmsGraphqlQueriesQuery}>
            {({ data }) => {
              const query = data.cmsGraphqlQueries.find(q => q.id.toString() === id);

              return <EditCmsGraphqlQuery initialQuery={query} history={history} />;
            }}
          </QueryWithStateDisplay>
        )}
      />
      <Route path="/cms_graphql_queries" component={CmsGraphqlQueriesAdminTable} />
    </Switch>
  );
}

export default CmsGraphqlQueriesAdmin;

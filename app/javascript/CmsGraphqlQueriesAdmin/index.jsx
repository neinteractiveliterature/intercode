import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import CmsGraphqlQueriesAdminTable from './CmsGraphqlQueriesAdminTable';
import { CmsGraphqlQueriesQuery } from './queries.gql';
import EditCmsGraphqlQuery from './EditCmsGraphqlQuery';
import NewCmsGraphqlQuery from './NewCmsGraphqlQuery';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

function CmsGraphqlQueriesAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route path="/new" render={() => <NewCmsGraphqlQuery />} />
        <Route
          path="/:id/edit"
          render={({ match: { params: { id } } }) => (
            <QueryWithStateDisplay query={CmsGraphqlQueriesQuery}>
              {({ data }) => {
                const query = data.cmsGraphqlQueries.find(q => q.id.toString() === id);

                return <EditCmsGraphqlQuery initialQuery={query} />;
              }}
            </QueryWithStateDisplay>
          )}
        />
        <Route
          path="/"
          render={() => <CmsGraphqlQueriesAdminTable />}
        />
      </Switch>
    </BrowserRouter>
  );
}

CmsGraphqlQueriesAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default CmsGraphqlQueriesAdmin;

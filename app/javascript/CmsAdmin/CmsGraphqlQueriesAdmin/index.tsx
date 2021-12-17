import { Routes, Route } from 'react-router-dom';

import CmsGraphqlQueriesAdminTable from './CmsGraphqlQueriesAdminTable';
import EditCmsGraphqlQuery from './EditCmsGraphqlQuery';
import NewCmsGraphqlQuery from './NewCmsGraphqlQuery';
import ViewCmsGraphqlQuerySource from './ViewCmsGraphqlQuerySource';

function CmsGraphqlQueriesAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_graphql_queries/:id/edit">
        <EditCmsGraphqlQuery />
      </Route>
      <Route path="/cms_graphql_queries/:id/view_source">
        <ViewCmsGraphqlQuerySource />
      </Route>
      <Route path="/cms_graphql_queries/new">
        <NewCmsGraphqlQuery />
      </Route>
      <Route path="/cms_graphql_queries">
        <CmsGraphqlQueriesAdminTable />
      </Route>
    </Routes>
  );
}

export default CmsGraphqlQueriesAdmin;

import { Routes, Route } from 'react-router-dom';

import CmsGraphqlQueriesAdminTable from './CmsGraphqlQueriesAdminTable';
import EditCmsGraphqlQuery from './EditCmsGraphqlQuery';
import NewCmsGraphqlQuery from './NewCmsGraphqlQuery';
import ViewCmsGraphqlQuerySource from './ViewCmsGraphqlQuerySource';

function CmsGraphqlQueriesAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_graphql_queries/:id/edit" element={<EditCmsGraphqlQuery />} />
      <Route path="/cms_graphql_queries/:id/view_source" element={<ViewCmsGraphqlQuerySource />} />
      <Route path="/cms_graphql_queries/new" element={<NewCmsGraphqlQuery />} />
      <Route path="/cms_graphql_queries" element={<CmsGraphqlQueriesAdminTable />} />
    </Routes>
  );
}

export default CmsGraphqlQueriesAdmin;

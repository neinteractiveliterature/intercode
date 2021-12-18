import { Routes, Route } from 'react-router-dom';

import CmsGraphqlQueriesAdminTable from './CmsGraphqlQueriesAdminTable';
import EditCmsGraphqlQuery from './EditCmsGraphqlQuery';
import NewCmsGraphqlQuery from './NewCmsGraphqlQuery';
import ViewCmsGraphqlQuerySource from './ViewCmsGraphqlQuerySource';

function CmsGraphqlQueriesAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path=":id/edit" element={<EditCmsGraphqlQuery />} />
      <Route path=":id/view_source" element={<ViewCmsGraphqlQuerySource />} />
      <Route path="new" element={<NewCmsGraphqlQuery />} />
      <Route path="" element={<CmsGraphqlQueriesAdminTable />} />
    </Routes>
  );
}

export default CmsGraphqlQueriesAdmin;

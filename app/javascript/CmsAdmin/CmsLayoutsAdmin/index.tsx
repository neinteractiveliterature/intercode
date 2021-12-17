import { Routes, Route } from 'react-router-dom';

import CmsLayoutsAdminTable from './CmsLayoutsAdminTable';
import EditCmsLayout from './EditCmsLayout';
import NewCmsLayout from './NewCmsLayout';
import ViewCmsLayoutSource from './ViewCmsLayoutSource';

function CmsLayoutsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_layouts/:id/edit">
        <EditCmsLayout />
      </Route>
      <Route path="/cms_layouts/:id/view_source">
        <ViewCmsLayoutSource />
      </Route>
      <Route path="/cms_layouts/new">
        <NewCmsLayout />
      </Route>
      <Route path="/cms_layouts">
        <CmsLayoutsAdminTable />
      </Route>
    </Routes>
  );
}

export default CmsLayoutsAdmin;

import { Routes, Route } from 'react-router-dom';

import CmsContentGroupsAdminTable from './CmsContentGroupsAdminTable';
import EditCmsContentGroup from './EditCmsContentGroup';
import NewCmsContentGroup from './NewCmsContentGroup';
import ViewCmsContentGroup from './ViewCmsContentGroup';

function CmsContentGroupsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_content_groups/:id/edit">
        <EditCmsContentGroup />
      </Route>
      <Route path="/cms_content_groups/new">
        <NewCmsContentGroup />
      </Route>
      <Route path="/cms_content_groups/:id">
        <ViewCmsContentGroup />
      </Route>
      <Route path="/cms_content_groups">
        <CmsContentGroupsAdminTable />
      </Route>
    </Routes>
  );
}

export default CmsContentGroupsAdmin;

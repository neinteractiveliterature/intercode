import { Routes, Route } from 'react-router-dom';

import CmsContentGroupsAdminTable from './CmsContentGroupsAdminTable';
import EditCmsContentGroup from './EditCmsContentGroup';
import NewCmsContentGroup from './NewCmsContentGroup';
import ViewCmsContentGroup from './ViewCmsContentGroup';

function CmsContentGroupsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_content_groups/:id/edit" element={<EditCmsContentGroup />} />
      <Route path="/cms_content_groups/new" element={<NewCmsContentGroup />} />
      <Route path="/cms_content_groups/:id" element={<ViewCmsContentGroup />} />
      <Route path="/cms_content_groups" element={<CmsContentGroupsAdminTable />} />
    </Routes>
  );
}

export default CmsContentGroupsAdmin;

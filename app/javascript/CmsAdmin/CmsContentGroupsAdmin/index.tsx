import { Routes, Route } from 'react-router-dom';

import CmsContentGroupsAdminTable from './CmsContentGroupsAdminTable';
import EditCmsContentGroup from './EditCmsContentGroup';
import NewCmsContentGroup from './NewCmsContentGroup';
import ViewCmsContentGroup from './ViewCmsContentGroup';

function CmsContentGroupsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path=":id/edit" element={<EditCmsContentGroup />} />
      <Route path="new" element={<NewCmsContentGroup />} />
      <Route path=":id" element={<ViewCmsContentGroup />} />
      <Route path="" element={<CmsContentGroupsAdminTable />} />
    </Routes>
  );
}

export default CmsContentGroupsAdmin;

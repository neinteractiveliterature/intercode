import { Routes, Route } from 'react-router-dom';

import CmsLayoutsAdminTable from './CmsLayoutsAdminTable';
import EditCmsLayout from './EditCmsLayout';
import NewCmsLayout from './NewCmsLayout';
import ViewCmsLayoutSource from './ViewCmsLayoutSource';

function CmsLayoutsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_layouts/:id/edit" element={<EditCmsLayout />} />
      <Route path="/cms_layouts/:id/view_source" element={<ViewCmsLayoutSource />} />
      <Route path="/cms_layouts/new" element={<NewCmsLayout />} />
      <Route path="/cms_layouts" element={<CmsLayoutsAdminTable />} />
    </Routes>
  );
}

export default CmsLayoutsAdmin;

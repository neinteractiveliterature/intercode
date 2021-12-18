import { Routes, Route } from 'react-router-dom';

import CmsLayoutsAdminTable from './CmsLayoutsAdminTable';
import EditCmsLayout from './EditCmsLayout';
import NewCmsLayout from './NewCmsLayout';
import ViewCmsLayoutSource from './ViewCmsLayoutSource';

function CmsLayoutsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path=":id/edit" element={<EditCmsLayout />} />
      <Route path=":id/view_source" element={<ViewCmsLayoutSource />} />
      <Route path="new" element={<NewCmsLayout />} />
      <Route path="" element={<CmsLayoutsAdminTable />} />
    </Routes>
  );
}

export default CmsLayoutsAdmin;

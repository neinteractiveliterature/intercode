import { Routes, Route } from 'react-router-dom';

import CmsPagesAdminTable from './CmsPagesAdminTable';
import EditCmsPage from './EditCmsPage';
import NewCmsPage from './NewCmsPage';
import ViewCmsPageSource from './ViewCmsPageSource';

function CmsPagesAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path=":id/edit" element={<EditCmsPage />} />
      <Route path=":id/view_source" element={<ViewCmsPageSource />} />
      <Route path="new" element={<NewCmsPage />} />
      <Route path="" element={<CmsPagesAdminTable />} />
    </Routes>
  );
}

export default CmsPagesAdmin;

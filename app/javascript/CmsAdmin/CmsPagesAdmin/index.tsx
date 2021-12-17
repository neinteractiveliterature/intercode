import { Routes, Route } from 'react-router-dom';

import CmsPagesAdminTable from './CmsPagesAdminTable';
import EditCmsPage from './EditCmsPage';
import NewCmsPage from './NewCmsPage';
import ViewCmsPageSource from './ViewCmsPageSource';

function CmsPagesAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_pages/:id/edit" element={<EditCmsPage />} />
      <Route path="/cms_pages/:id/view_source" element={<ViewCmsPageSource />} />
      <Route path="/cms_pages/new" element={<NewCmsPage />} />
      <Route path="/cms_pages" element={<CmsPagesAdminTable />} />
    </Routes>
  );
}

export default CmsPagesAdmin;

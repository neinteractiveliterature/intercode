import { Routes, Route } from 'react-router-dom';

import CmsPartialsAdminTable from './CmsPartialsAdminTable';
import EditCmsPartial from './EditCmsPartial';
import NewCmsPartial from './NewCmsPartial';
import ViewCmsPartialSource from './ViewCmsPartialSource';

function CmsPartialsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_partials/:id/edit" element={<EditCmsPartial />} />
      <Route path="/cms_partials/:id/view_source" element={<ViewCmsPartialSource />} />
      <Route path="/cms_partials/new" element={<NewCmsPartial />} />
      <Route path="/cms_partials" element={<CmsPartialsAdminTable />} />
    </Routes>
  );
}

export default CmsPartialsAdmin;

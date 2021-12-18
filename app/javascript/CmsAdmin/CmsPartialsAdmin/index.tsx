import { Routes, Route } from 'react-router-dom';

import CmsPartialsAdminTable from './CmsPartialsAdminTable';
import EditCmsPartial from './EditCmsPartial';
import NewCmsPartial from './NewCmsPartial';
import ViewCmsPartialSource from './ViewCmsPartialSource';

function CmsPartialsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path=":id/edit" element={<EditCmsPartial />} />
      <Route path=":id/view_source" element={<ViewCmsPartialSource />} />
      <Route path="new" element={<NewCmsPartial />} />
      <Route path="" element={<CmsPartialsAdminTable />} />
    </Routes>
  );
}

export default CmsPartialsAdmin;

import { Routes, Route } from 'react-router-dom';

import CmsPartialsAdminTable from './CmsPartialsAdminTable';
import EditCmsPartial from './EditCmsPartial';
import NewCmsPartial from './NewCmsPartial';
import ViewCmsPartialSource from './ViewCmsPartialSource';

function CmsPartialsAdmin(): JSX.Element {
  return (
    <Routes>
      <Route path="/cms_partials/:id/edit">
        <EditCmsPartial />
      </Route>
      <Route path="/cms_partials/:id/view_source">
        <ViewCmsPartialSource />
      </Route>
      <Route path="/cms_partials/new">
        <NewCmsPartial />
      </Route>
      <Route path="/cms_partials">
        <CmsPartialsAdminTable />
      </Route>
    </Routes>
  );
}

export default CmsPartialsAdmin;

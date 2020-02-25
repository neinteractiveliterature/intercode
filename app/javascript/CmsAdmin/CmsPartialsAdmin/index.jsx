import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPartialsAdminTable from './CmsPartialsAdminTable';
import EditCmsPartial from './EditCmsPartial';
import NewCmsPartial from './NewCmsPartial';
import ViewCmsPartialSource from './ViewCmsPartialSource';

function CmsPartialsAdmin() {
  return (
    <Switch>
      <Route path="/cms_partials/:id/edit"><EditCmsPartial /></Route>
      <Route path="/cms_partials/:id/view_source"><ViewCmsPartialSource /></Route>
      <Route path="/cms_partials/new"><NewCmsPartial /></Route>
      <Route path="/cms_partials"><CmsPartialsAdminTable /></Route>
    </Switch>
  );
}

export default CmsPartialsAdmin;

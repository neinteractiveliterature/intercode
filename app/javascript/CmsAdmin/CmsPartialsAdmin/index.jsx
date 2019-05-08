import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPartialsAdminTable from './CmsPartialsAdminTable';
import EditCmsPartial from './EditCmsPartial';
import NewCmsPartial from './NewCmsPartial';

function CmsPartialsAdmin() {
  return (
    <Switch>
      <Route path="/cms_partials/:id/:edit" component={EditCmsPartial} />
      <Route path="/cms_partials/new" component={NewCmsPartial} />
      <Route path="/cms_partials" component={CmsPartialsAdminTable} />
    </Switch>
  );
}

export default CmsPartialsAdmin;

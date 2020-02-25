import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsLayoutsAdminTable from './CmsLayoutsAdminTable';
import EditCmsLayout from './EditCmsLayout';
import NewCmsLayout from './NewCmsLayout';
import ViewCmsLayoutSource from './ViewCmsLayoutSource';

function CmsLayoutsAdmin() {
  return (
    <Switch>
      <Route path="/cms_layouts/:id/edit"><EditCmsLayout /></Route>
      <Route path="/cms_layouts/:id/view_source"><ViewCmsLayoutSource /></Route>
      <Route path="/cms_layouts/new"><NewCmsLayout /></Route>
      <Route path="/cms_layouts"><CmsLayoutsAdminTable /></Route>
    </Switch>
  );
}

export default CmsLayoutsAdmin;

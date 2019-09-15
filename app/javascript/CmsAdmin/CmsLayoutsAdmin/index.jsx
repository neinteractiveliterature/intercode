import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsLayoutsAdminTable from './CmsLayoutsAdminTable';
import EditCmsLayout from './EditCmsLayout';
import NewCmsLayout from './NewCmsLayout';
import ViewCmsLayoutSource from './ViewCmsLayoutSource';

function CmsLayoutsAdmin() {
  return (
    <Switch>
      <Route path="/cms_layouts/:id/edit" component={EditCmsLayout} />
      <Route path="/cms_layouts/:id/view_source" component={ViewCmsLayoutSource} />
      <Route path="/cms_layouts/new" component={NewCmsLayout} />
      <Route path="/cms_layouts" component={CmsLayoutsAdminTable} />
    </Switch>
  );
}

export default CmsLayoutsAdmin;

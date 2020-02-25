import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPagesAdminTable from './CmsPagesAdminTable';
import EditCmsPage from './EditCmsPage';
import NewCmsPage from './NewCmsPage';
import ViewCmsPageSource from './ViewCmsPageSource';

function CmsPagesAdmin() {
  return (
    <Switch>
      <Route path="/cms_pages/:id/edit"><EditCmsPage /></Route>
      <Route path="/cms_pages/:id/view_source"><ViewCmsPageSource /></Route>
      <Route path="/cms_pages/new"><NewCmsPage /></Route>
      <Route path="/cms_pages"><CmsPagesAdminTable /></Route>
    </Switch>
  );
}

export default CmsPagesAdmin;

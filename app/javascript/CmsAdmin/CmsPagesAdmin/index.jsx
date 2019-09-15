import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPagesAdminTable from './CmsPagesAdminTable';
import EditCmsPage from './EditCmsPage';
import NewCmsPage from './NewCmsPage';
import ViewCmsPageSource from './ViewCmsPageSource';

function CmsPagesAdmin() {
  return (
    <Switch>
      <Route path="/cms_pages/:id/edit" component={EditCmsPage} />
      <Route path="/cms_pages/:id/view_source" component={ViewCmsPageSource} />
      <Route path="/cms_pages/new" component={NewCmsPage} />
      <Route path="/cms_pages" component={CmsPagesAdminTable} />
    </Switch>
  );
}

export default CmsPagesAdmin;

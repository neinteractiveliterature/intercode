import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPagesAdminTable from './CmsPagesAdminTable';
import EditCmsPage from './EditCmsPage';
import NewCmsPage from './NewCmsPage';

function CmsPagesAdmin() {
  return (
    <Switch>
      <Route path="/cms_pages/:id/:edit" component={EditCmsPage} />
      <Route path="/cms_pages/new" component={NewCmsPage} />
      <Route path="/cms_pages" component={CmsPagesAdminTable} />
    </Switch>
  );
}

export default CmsPagesAdmin;

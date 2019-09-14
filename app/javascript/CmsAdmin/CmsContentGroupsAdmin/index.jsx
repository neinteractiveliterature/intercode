import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsContentGroupsAdminTable from './CmsContentGroupsAdminTable';
import EditCmsContentGroup from './EditCmsContentGroup';
import NewCmsContentGroup from './NewCmsContentGroup';

function CmsContentGroupsAdmin() {
  return (
    <Switch>
      <Route path="/cms_content_groups/:id/:edit" component={EditCmsContentGroup} />
      <Route path="/cms_content_groups/new" component={NewCmsContentGroup} />
      <Route path="/cms_content_groups" component={CmsContentGroupsAdminTable} />
    </Switch>
  );
}

export default CmsContentGroupsAdmin;

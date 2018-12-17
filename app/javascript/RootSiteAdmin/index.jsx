import React from 'react';

import EditRootSite from './EditRootSite';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { RootSiteAdminQuery } from './queries.gql';

function RootSiteAdmin() {
  return (
    <QueryWithStateDisplay query={RootSiteAdminQuery}>
      {({ data }) => (
        <EditRootSite
          initialRootSite={data.rootSite}
          cmsPages={data.cmsPages}
          cmsLayouts={data.cmsLayouts}
        />
      )}
    </QueryWithStateDisplay>
  );
}

export default RootSiteAdmin;

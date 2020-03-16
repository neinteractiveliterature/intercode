import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import RootSiteConventionsAdminTable from './RootSiteConventionsAdminTable';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import ConventionDisplay from './ConventionDisplay';
import LoadingIndicator from '../LoadingIndicator';
import { useConventionQueryFromIdParam } from './conventionQueryHooks';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function ConventionBreadcrumb() {
  const { data, loading, error } = useConventionQueryFromIdParam();

  if (loading) { return <LoadingIndicator />; }
  if (error) { return 'Convention'; }

  return <BreadcrumbItem active>{data.convention.name}</BreadcrumbItem>;
}

function RootSiteConventionsAdmin() {
  const authorizationWarning = useAuthorizationRequired('can_manage_conventions');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem
          to="/conventions?sort.starts_at=desc"
          matchProps={{ path: '/conventions', exact: true }}
        >
          Conventions
        </RouteActivatedBreadcrumbItem>

        <Route path="/conventions/:id"><ConventionBreadcrumb /></Route>
      </ol>

      <Switch>
        <Route path="/conventions/:id"><ConventionDisplay /></Route>
        <Route path="/conventions" exact><RootSiteConventionsAdminTable /></Route>
        <Redirect to="/conventions?sort.starts_at=desc" />
      </Switch>
    </>
  );
}

export default RootSiteConventionsAdmin;

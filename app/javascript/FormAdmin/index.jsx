import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import FormAdminIndex from './FormAdminIndex';
import { FormAdminQuery } from './queries.gql';
import FormJSONEditor from './FormJSONEditor';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';

function FormAdmin() {
  const { data, loading, error } = useQuery(FormAdminQuery);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: '/admin_forms', exact: true }}
            to="/admin_forms"
          >
            Forms
          </RouteActivatedBreadcrumbItem>

          <Route path="/admin_forms/edit_advanced">
            <BreadcrumbItem active>Edit form (advanced)</BreadcrumbItem>
          </Route>
        </ol>
      </nav>

      <Switch>
        <Route
          path="/admin_forms/:id/edit_advanced"
          render={({ match, history }) => (
            <FormJSONEditor
              history={history}
              initialForm={data.convention.forms
                .find((form) => form.id.toString(10) === match.params.id)}
            />
          )}
        />
        <Route path="/admin_forms" render={() => <FormAdminIndex />} />
      </Switch>
    </>
  );
}

export default FormAdmin;

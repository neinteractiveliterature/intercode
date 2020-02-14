import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import FormAdminIndex from './FormAdminIndex';
import { FormAdminQuery } from './queries.gql';
import FormJSONEditor from './FormJSONEditor';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';

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
          <BreadcrumbItemWithRoute
            path="/admin_forms/"
            to="/admin_forms"
            exact
          >
            Forms
          </BreadcrumbItemWithRoute>

          <BreadcrumbItemWithRoute
            path="/admin_forms/edit_advanced"
            to="/admin_forms/edit_advanced"
            hideUnlessMatch
          >
            Edit form (advanced)
          </BreadcrumbItemWithRoute>
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

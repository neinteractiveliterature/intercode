import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import FormAdminIndex from './FormAdminIndex';
import { FormAdminQuery } from './queries.gql';
import FormEditor from './FormEditor';
import FormJSONEditor from './FormJSONEditor';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';

function FormAdmin() {
  const { data, error } = useQuerySuspended(FormAdminQuery);

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
            path="/admin_forms/new"
            to="/admin_forms/new"
            hideUnlessMatch
          >
            New form
          </BreadcrumbItemWithRoute>
        </ol>
      </nav>

      <Switch>
        <Route
          path="/admin_forms/new"
          render={({ history }) => (
            <FormJSONEditor
              history={history}
              initialForm={{
                id: null,
                form_type: '',
                export_json: '{ "title": "", "sections": [] }',
              }}
            />
          )}
        />
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

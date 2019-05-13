import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import FormAdminIndex from './FormAdminIndex';
import { FormAdminQuery } from './queries.gql';
import FormJSONEditor from './FormJSONEditor';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

function FormAdmin() {
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

          <BreadcrumbItemWithRoute
            path="/admin_forms/:id/edit"
            to={({ match }) => `/admin_forms/${match.params.id}/edit`}
            hideUnlessMatch
          >
            Edit form
          </BreadcrumbItemWithRoute>
        </ol>
      </nav>

      <Switch>
        <Route
          path="/admin_forms/new"
          render={() => (
            <FormJSONEditor
              initialForm={{
                id: null,
                export_json: '{ "title": "", "sections": [] }',
              }}
            />
          )}
        />
        <Route
          path="/admin_forms/:id/edit"
          render={({ match }) => (
            <QueryWithStateDisplay query={FormAdminQuery}>
              {({ data }) => (
                <FormJSONEditor
                  initialForm={data.convention.forms
                    .find(form => form.id.toString(10) === match.params.id)}
                />
              )}
            </QueryWithStateDisplay>
          )}
        />
        <Route path="/admin_forms" render={() => <FormAdminIndex />} />
      </Switch>
    </>
  );
}

export default FormAdmin;

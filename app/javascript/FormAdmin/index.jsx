import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import FormAdminIndex from './FormAdminIndex';
import { FormAdminQuery } from './queries.gql';
import FormJSONEditor from './FormJSONEditor';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

function FormAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <BreadcrumbItemWithRoute
              path="/"
              to="/"
              exact
            >
              Forms
            </BreadcrumbItemWithRoute>

            <BreadcrumbItemWithRoute
              path="/new"
              to="/new"
              hideUnlessMatch
            >
              New form
            </BreadcrumbItemWithRoute>

            <BreadcrumbItemWithRoute
              path="/:id/edit"
              to={({ match }) => `/${match.params.id}/edit`}
              hideUnlessMatch
            >
              Edit form
            </BreadcrumbItemWithRoute>
          </ol>
        </nav>

        <Switch>
          <Route
            path="/new"
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
            path="/:id/edit"
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
          <Route path="/" render={() => <FormAdminIndex />} />
        </Switch>
      </>
    </BrowserRouter>
  );
}

FormAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default FormAdmin;

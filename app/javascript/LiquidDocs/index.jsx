import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';

import AssignDoc from './AssignDoc';
import AssignDocLink from './AssignDocLink';
import { LiquidAssignsQuery } from './queries.gql';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

function sortAssigns(assigns) {
  return [...assigns].sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));
}

function LiquidDocs({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <QueryWithStateDisplay query={LiquidAssignsQuery}>
        {({ data: { liquidAssigns } }) => {
          const sortedAssigns = sortAssigns(liquidAssigns);

          return (
            <Switch>
              {sortedAssigns.map(assign => (
                <Route
                  path={`/assigns/${assign.name}(\\..*)?`}
                  render={() => (
                    <AssignDoc assign={assign} />
                  )}
                  key={`route-${assign.name}`}
                />
              ))}

              <Route path="/" exact>
                <React.Fragment>
                  <header className="mb-4">
                    <h1>Liquid documentation</h1>
                  </header>

                  {
                    sortedAssigns.map(assign => <AssignDocLink assign={assign} key={assign.name} />)
                  }
                </React.Fragment>
              </Route>
              { // <Redirect to="/" />
              }
            </Switch>
          );
        }}
      </QueryWithStateDisplay>
    </BrowserRouter>
  );
}

LiquidDocs.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default LiquidDocs;

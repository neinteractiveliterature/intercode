import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import gql from 'graphql-tag';
import classNames from 'classnames';

import EditSignup from './EditSignup';
import LoadingIndicator from '../LoadingIndicator';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import RunHeader from './RunHeader';
import RunSignupsTable from './RunSignupsTable';

const eventQuery = gql`
query($eventId: Int!) {
  event(id: $eventId) {
    id
    title
  }
}
`;

const EventAdminApp = ({
  basename,
  runId,
  eventId,
  eventUrl,
  exportSignupsUrl,
  teamMembersUrl,
}) => (
  <BrowserRouter basename={basename}>
    <div>
      <QueryWithStateDisplay query={eventQuery} variables={{ eventId }}>
        {({ data }) => (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={eventUrl}>
                  {data.event.title}
                </a>
              </li>
              <Route path="/" exact>
                {({ match }) => (
                  <li className={classNames('breadcrumb-item', { active: match })}>
                    <Link to="/?filters.state=confirmed%2Cwaitlisted&sort.id=asc">
                      Signups
                    </Link>
                  </li>
                )}
              </Route>
              <Route
                path="/:id/edit"
                render={() => (
                  <li className="breadcrumb-item active">
                    Edit signup
                  </li>
                )}
              />
            </ol>
          </nav>
        )}
      </QueryWithStateDisplay>

      <Switch>
        <Route path="/:id/edit" render={({ match }) => <EditSignup id={Number.parseInt(match.params.id, 10)} teamMembersUrl={teamMembersUrl} />} />
        <Route
          path="/"
          exact
          render={() => (
            <div>
              <RunHeader runId={runId} eventId={eventId} />
              <RunSignupsTable
                runId={runId}
                eventId={eventId}
                exportUrl={exportSignupsUrl}
                defaultVisibleColumns={['id', 'state', 'name', 'bucket', 'age', 'email']}
              />
            </div>
          )}
        />
        <Redirect to="/" />
      </Switch>
    </div>
  </BrowserRouter>
);

EventAdminApp.propTypes = {
  basename: PropTypes.string.isRequired,
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  eventUrl: PropTypes.string.isRequired,
  exportSignupsUrl: PropTypes.string.isRequired,
  teamMembersUrl: PropTypes.string.isRequired,
};

export default EventAdminApp;

import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import classNames from 'classnames';

import EditSignup from './EditSignup';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import SignupsIndex from './SignupsIndex';
import { SignupAdminEventQuery } from './queries.gql';

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
      <QueryWithStateDisplay query={SignupAdminEventQuery} variables={{ eventId }}>
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
          render={() => (
            <SignupsIndex runId={runId} eventId={eventId} exportSignupsUrl={exportSignupsUrl} />
          )}
        />
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

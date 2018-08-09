import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import EditSignup from './EditSignup';
import RunHeader from './RunHeader';
import RunSignupsTable from './RunSignupsTable';

const EventAdminApp = ({
  basename,
  runId,
  eventId,
  exportSignupsUrl,
  teamMembersUrl,
}) => (
  <BrowserRouter basename={basename}>
    <div>
      <Switch>
        <Route path="/:id/edit" render={({ match }) => <EditSignup id={Number.parseInt(match.params.id, 10)} teamMembersUrl={teamMembersUrl} />} />
        <Route
          path="/"
          render={() => (
            <div>
              <RunHeader runId={runId} eventId={eventId} />
              <RunSignupsTable runId={runId} eventId={eventId} exportUrl={exportSignupsUrl} />
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
  exportSignupsUrl: PropTypes.string.isRequired,
  teamMembersUrl: PropTypes.string.isRequired,
};

export default EventAdminApp;

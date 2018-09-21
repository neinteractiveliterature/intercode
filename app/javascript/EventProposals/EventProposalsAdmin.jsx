import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import EventProposalsAdminTable from './EventProposalsAdminTable';

// <Route
//   path="/:id/edit"
//   render={({ match }) => <EditUserConProfile id={Number.parseInt(match.params.id, 10)} />}
// />
// <Route
//   path="/:id"
//   render={({ match }) => (
//     <UserConProfileAdminDisplay userConProfileId={Number.parseInt(match.params.id, 10)} />
//   )}
// />

const EventProposalsAdmin = ({
  basename,
  exportUrl,
}) => (
  <BrowserRouter basename={basename}>
    <Switch>

      <Route
        render={() => (
          <React.Fragment>
            <h1>Event Proposals</h1>
            <EventProposalsAdminTable
              exportUrl={exportUrl}
              defaultVisibleColumns={['title', 'owner', 'capacity', 'length_seconds', 'status', 'submitted_at', 'updated_at']}
            />
          </React.Fragment>
        )}
      />
    </Switch>
  </BrowserRouter>
);

EventProposalsAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
  exportUrl: PropTypes.string.isRequired,
};

export default EventProposalsAdmin;

import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, Link, Switch, Route,
} from 'react-router-dom';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EventProposalAdminDisplay from './EventProposalAdminDisplay';
import EventProposalForm from './EventProposalForm';
import { eventProposalQueryWithOwner } from './queries';
import EventProposalsAdminTable from './EventProposalsAdminTable';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

const EventProposalsAdmin = ({
  basename,
  exportUrl,
}) => (
  <BrowserRouter basename={basename}>
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItemWithRoute
            path="/"
            to="/?sort.status=asc&sort.submitted_at=desc"
            active={({ location }) => location.pathname === '/'}
          >
            Event proposals
          </BreadcrumbItemWithRoute>

          <Route
            path="/:id"
            render={({ match }) => (
              <QueryWithStateDisplay
                query={eventProposalQueryWithOwner}
                variables={{ eventProposalId: Number.parseInt(match.params.id, 10) }}
              >
                {({ data }) => (
                  <React.Fragment>
                    <BreadcrumbItemWithRoute
                      path="/:id"
                      to={`/${match.params.id}`}
                      exact
                    >
                      {data.eventProposal.title}
                    </BreadcrumbItemWithRoute>
                    <Route
                      path="/:id/edit"
                      render={() => (
                        <BreadcrumbItem to={`/${match.params.id}/edit`} active>
                          Edit
                        </BreadcrumbItem>
                      )}
                    />
                  </React.Fragment>
                )}
              </QueryWithStateDisplay>
            )}
          />
        </ol>
      </nav>


      <Switch>
        <Route
          path="/:id/edit"
          render={({ match, history }) => (
            <EventProposalForm
              eventProposalId={Number.parseInt(match.params.id, 10)}
              afterSubmit={() => { history.push(`/${match.params.id}`); }}
              exitButton={(
                <Link
                  className="btn btn-outline-secondary mr-2"
                  to={`/${match.params.id}`}
                >
                  Return to proposal
                </Link>
              )}
            />
          )}
        />
        <Route
          path="/:id"
          render={({ match }) => (
            <EventProposalAdminDisplay eventProposalId={Number.parseInt(match.params.id, 10)} />
          )}
        />
        <Route
          render={() => (
            <React.Fragment>
              <h1>Event Proposals</h1>
              <EventProposalsAdminTable
                exportUrl={exportUrl}
                defaultVisibleColumns={['title', 'owner', 'capacity', 'duration', 'status', 'submitted_at', 'updated_at']}
              />
            </React.Fragment>
          )}
        />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

EventProposalsAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
  exportUrl: PropTypes.string.isRequired,
};

export default EventProposalsAdmin;

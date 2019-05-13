import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EventProposalAdminDisplay from './EventProposalAdminDisplay';
import EventProposalForm from './EventProposalForm';
import { EventProposalQueryWithOwner } from './queries.gql';
import EventProposalsAdminTable from './EventProposalsAdminTable';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

const EventProposalsAdmin = () => (
  <React.Fragment>
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <BreadcrumbItemWithRoute
          path="/admin_event_proposals"
          to="/admin_event_proposals?sort.status=asc&sort.submitted_at=desc"
          active={({ location }) => location.pathname === '/admin_event_proposals'}
        >
          Event proposals
        </BreadcrumbItemWithRoute>

        <Route
          path="/admin_event_proposals/:id"
          render={({ match }) => (
            <QueryWithStateDisplay
              query={EventProposalQueryWithOwner}
              variables={{ eventProposalId: Number.parseInt(match.params.id, 10) }}
            >
              {({ data }) => (
                <React.Fragment>
                  <BreadcrumbItemWithRoute
                    path="/admin_event_proposals/:id"
                    to={`/${match.params.id}`}
                    exact
                  >
                    {data.eventProposal.title}
                  </BreadcrumbItemWithRoute>
                  <Route
                    path="/admin_event_proposals/:id/edit"
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
        path="/admin_event_proposals/:id/edit"
        render={({ match, history }) => (
          <EventProposalForm
            eventProposalId={Number.parseInt(match.params.id, 10)}
            afterSubmit={() => { history.push(`/admin_event_proposals/${match.params.id}`); }}
            exitButton={(
              <Link
                className="btn btn-outline-secondary mr-2"
                to={`/admin_event_proposals/${match.params.id}`}
              >
                Return to proposal
              </Link>
            )}
          />
        )}
      />
      <Route
        path="/admin_event_proposals/:id"
        render={({ match }) => (
          <EventProposalAdminDisplay eventProposalId={Number.parseInt(match.params.id, 10)} />
        )}
      />
      <Route
        render={() => (
          <React.Fragment>
            <h1>Event Proposals</h1>
            <EventProposalsAdminTable
              exportUrl="/admin_event_proposals/export.csv"
              defaultVisibleColumns={['event_category', 'title', 'owner', 'capacity', 'duration', 'status', 'submitted_at', 'updated_at']}
            />
          </React.Fragment>
        )}
      />
    </Switch>
  </React.Fragment>
);

export default EventProposalsAdmin;

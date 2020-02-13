import React from 'react';
import PropTypes from 'prop-types';
import {
  Link, Switch, Route, useParams, useHistory,
} from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EventProposalAdminDisplay from './EventProposalAdminDisplay';
import EventProposalForm from './EventProposalForm';
import { EventProposalQuery, EventProposalQueryWithOwner } from './queries.gql';
import EventProposalsAdminTable from './EventProposalsAdminTable';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import EventProposalHistory from './EventProposalHistory';
import LoadingIndicator from '../LoadingIndicator';

function SingleProposalBreadcrumbs({ match }) {
  const eventProposalId = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(EventProposalQueryWithOwner, {
    variables: { eventProposalId },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <BreadcrumbItemWithRoute
        path="/admin_event_proposals/:id"
        to={`/admin_event_proposals/${match.params.id}`}
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
      <Route
        path="/admin_event_proposals/:id/history"
        render={() => (
          <BreadcrumbItem to={`/${match.params.id}/history`} active>
            History
          </BreadcrumbItem>
        )}
      />
    </>
  );
}

SingleProposalBreadcrumbs.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

function AdminEditEventProposal() {
  const history = useHistory();
  const eventProposalId = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(EventProposalQuery, { variables: { eventProposalId } });

  usePageTitle(
    useValueUnless(() => `Editing “${data.eventProposal.title}”`, loading || error),
  );

  return (
    <EventProposalForm
      eventProposalId={eventProposalId}
      afterSubmit={() => { history.push(`/admin_event_proposals/${eventProposalId}`); }}
      exitButton={(
        <Link
          className="btn btn-outline-secondary mr-2"
          to={`/admin_event_proposals/${eventProposalId}`}
        >
          Return to proposal
        </Link>
      )}
    />
  );
}

function EventProposalsAdmin() {
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItemWithRoute
            path="/admin_event_proposals"
            to="/admin_event_proposals?sort.status=asc&sort.submitted_at=desc"
            active={({ location }) => location.pathname === '/admin_event_proposals'}
          >
            Event proposals
          </BreadcrumbItemWithRoute>

          <Route path="/admin_event_proposals/:id" component={SingleProposalBreadcrumbs} />
        </ol>
      </nav>

      <Switch>
        <Route path="/admin_event_proposals/:id/history" component={EventProposalHistory} />
        <Route path="/admin_event_proposals/:id/edit" component={AdminEditEventProposal} />
        <Route path="/admin_event_proposals/:id" component={EventProposalAdminDisplay} />
        <Route component={EventProposalsAdminTable} />
      </Switch>
    </>
  );
}

export default EventProposalsAdmin;

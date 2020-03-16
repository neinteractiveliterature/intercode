import React from 'react';
import {
  Link, Switch, Route, useParams, useHistory,
} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import EventProposalAdminDisplay from './EventProposalAdminDisplay';
import EventProposalForm from './EventProposalForm';
import { EventProposalQuery, EventProposalQueryWithOwner } from './queries.gql';
import EventProposalsAdminTable from './EventProposalsAdminTable';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import EventProposalHistory from './EventProposalHistory';
import LoadingIndicator from '../LoadingIndicator';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function SingleProposalBreadcrumbs() {
  const params = useParams();
  const eventProposalId = Number.parseInt(params.id, 10);
  const { data, loading, error } = useQuery(EventProposalQueryWithOwner, {
    variables: { eventProposalId },
  });

  if (loading) {
    return <BreadcrumbItem active><LoadingIndicator /></BreadcrumbItem>;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <RouteActivatedBreadcrumbItem
        matchProps={{ path: '/admin_event_proposals/:id', exact: true }}
        to={`/admin_event_proposals/${params.id}`}
      >
        {data.eventProposal.title}
      </RouteActivatedBreadcrumbItem>

      <Route path="/admin_event_proposals/:id/edit">
        <BreadcrumbItem active>Edit</BreadcrumbItem>
      </Route>

      <Route path="/admin_event_proposals/:id/history">
        <BreadcrumbItem active>History</BreadcrumbItem>
      </Route>
    </>
  );
}

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
  const authorizationWarning = useAuthorizationRequired('can_read_event_proposals');

  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: '/admin_event_proposals', exact: true }}
            to="/admin_event_proposals?sort.status=asc&sort.submitted_at=desc"
          >
            Event proposals
          </RouteActivatedBreadcrumbItem>

          <Route path="/admin_event_proposals/:id"><SingleProposalBreadcrumbs /></Route>
        </ol>
      </nav>

      <Switch>
        <Route path="/admin_event_proposals/:id/history"><EventProposalHistory /></Route>
        <Route path="/admin_event_proposals/:id/edit"><AdminEditEventProposal /></Route>
        <Route path="/admin_event_proposals/:id"><EventProposalAdminDisplay /></Route>
        <Route path="/admin_event_proposals"><EventProposalsAdminTable /></Route>
      </Switch>
    </>
  );
}

export default EventProposalsAdmin;

import { Link, Switch, Route, useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import EventProposalAdminDisplay from './EventProposalAdminDisplay';
import EventProposalForm from './EventProposalForm';
import EventProposalsAdminTable from './EventProposalsAdminTable';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import EventProposalHistory from './EventProposalHistory';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useEventProposalQuery, useEventProposalQueryWithOwner } from './queries.generated';

function SingleProposalBreadcrumbs() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const eventProposalId = params.id;
  const { data, loading, error } = useEventProposalQueryWithOwner({
    variables: { eventProposalId },
  });

  if (loading) {
    return (
      <BreadcrumbItem active>
        <LoadingIndicator iconSet="bootstrap-icons" />
      </BreadcrumbItem>
    );
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
        {data?.convention.event_proposal.title}
      </RouteActivatedBreadcrumbItem>

      <Route path="/admin_event_proposals/:id/edit">
        <BreadcrumbItem active>{t('navigation.general.edit', 'Edit')}</BreadcrumbItem>
      </Route>

      <Route path="/admin_event_proposals/:id/history">
        <BreadcrumbItem active>{t('navigation.general.history', 'History')}</BreadcrumbItem>
      </Route>
    </>
  );
}

function AdminEditEventProposal() {
  const { t } = useTranslation();
  const history = useHistory();
  const eventProposalId = useParams<{ id: string }>().id;
  const { data, loading, error } = useEventProposalQuery({ variables: { eventProposalId } });

  usePageTitle(
    useValueUnless(
      () =>
        t('general.pageTitles.editing', 'Editing “{{ title }}”', {
          title: data?.convention.event_proposal.title,
        }),
      error || loading,
    ),
  );

  return (
    <EventProposalForm
      eventProposalId={eventProposalId}
      afterSubmit={() => {
        history.push(`/admin_event_proposals/${eventProposalId}`);
      }}
      exitButton={
        <Link className="btn btn-outline-secondary me-2" to={`/admin_event_proposals/${eventProposalId}`}>
          {t('admin.eventProposals.edit.exitButton', 'Return to proposal')}
        </Link>
      }
    />
  );
}

function EventProposalsAdmin(): JSX.Element {
  const { t } = useTranslation();
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
            {t('navigation.admin.eventProposals', 'Event Proposals')}
          </RouteActivatedBreadcrumbItem>

          <Route path="/admin_event_proposals/:id">
            <SingleProposalBreadcrumbs />
          </Route>
        </ol>
      </nav>

      <Switch>
        <Route path="/admin_event_proposals/:id/history">
          <EventProposalHistory />
        </Route>
        <Route path="/admin_event_proposals/:id/edit">
          <AdminEditEventProposal />
        </Route>
        <Route path="/admin_event_proposals/:id">
          <EventProposalAdminDisplay />
        </Route>
        <Route path="/admin_event_proposals">
          <EventProposalsAdminTable />
        </Route>
      </Switch>
    </>
  );
}

export default EventProposalsAdmin;

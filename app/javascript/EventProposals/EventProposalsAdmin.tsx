import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
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
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';

function SingleProposalBreadcrumbs() {
  const { t } = useTranslation();
  const { id } = useParams<'id'>();
  if (id == null) {
    throw new Error('id not found in URL params');
  }
  const { data, loading, error } = useEventProposalQueryWithOwner({
    variables: { eventProposalId: id },
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
      <RouteActivatedBreadcrumbItem to="" end>
        {data?.convention.event_proposal.title}
      </RouteActivatedBreadcrumbItem>
      <LeafBreadcrumbItem path="edit">{t('navigation.general.edit')}</LeafBreadcrumbItem>
      <RouteActivatedBreadcrumbItem to="history" hideUnlessMatch>
        {t('navigation.general.history')}
      </RouteActivatedBreadcrumbItem>
    </>
  );
}

function AdminEditEventProposal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const eventProposalId = useParams<{ id: string }>().id;
  if (eventProposalId == null) {
    throw new Error('id not found in URL params');
  }
  const { data, loading, error } = useEventProposalQuery({ variables: { eventProposalId } });

  usePageTitle(
    useValueUnless(
      () =>
        t('general.pageTitles.editing', {
          title: data?.convention.event_proposal.title,
        }),
      error || loading,
    ),
  );

  return (
    <EventProposalForm
      eventProposalId={eventProposalId}
      afterSubmit={() => {
        navigate(`/admin_event_proposals/${eventProposalId}`);
      }}
      exitButton={
        <Link className="btn btn-outline-secondary me-2" to={`/admin_event_proposals/${eventProposalId}`}>
          {t('admin.eventProposals.edit.exitButton')}
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
          <RouteActivatedBreadcrumbItem to=".?sort.status=asc&sort.submitted_at=desc" end>
            {t('navigation.admin.eventProposals')}
          </RouteActivatedBreadcrumbItem>

          <Routes>
            <Route path=":id/*" element={<SingleProposalBreadcrumbs />} />
          </Routes>
        </ol>
      </nav>
      <Routes>
        <Route path=":id/history/*" element={<EventProposalHistory />} />
        <Route path=":id/edit" element={<AdminEditEventProposal />} />
        <Route path=":id" element={<EventProposalAdminDisplay />} />
        <Route path="" element={<EventProposalsAdminTable />} />
      </Routes>
    </>
  );
}

export default EventProposalsAdmin;

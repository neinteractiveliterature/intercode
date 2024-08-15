import { Outlet, useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { EventProposalQueryWithOwnerQueryData } from './queries.generated';
import { NamedRoute } from '../AppRouter';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';

function SingleProposalBreadcrumbs() {
  const { t } = useTranslation();

  const data = useRouteLoaderData(NamedRoute.AdminEventProposal) as EventProposalQueryWithOwnerQueryData | undefined;
  if (!data) {
    return <></>;
  }

  return (
    <>
      <NamedRouteBreadcrumbItem routeId={['AdminEventProposal', 'EventProposalAdminDisplay']}>
        {data?.convention.event_proposal.title}
      </NamedRouteBreadcrumbItem>
      <NamedRouteBreadcrumbItem routeId="AdminEditEventProposal">
        {t('navigation.general.edit')}
      </NamedRouteBreadcrumbItem>
      <NamedRouteBreadcrumbItem routeId={['EventProposalHistory', 'EventProposalHistoryChangeGroup']}>
        {t('navigation.general.history')}
      </NamedRouteBreadcrumbItem>
    </>
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

          <SingleProposalBreadcrumbs />
        </ol>
      </nav>

      <Outlet />
    </>
  );
}

export const Component = EventProposalsAdmin;

import { Outlet, useRouteLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { NamedRoute } from '../routes';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import { useContext } from 'react';
import AppRootContext from 'AppRootContext';
import { SiteMode } from 'graphqlTypes.generated';
import FourOhFourPage from 'FourOhFourPage';
import { Info as AdminEditEventProposalInfo } from './+types/AdminEditEventProposal';
import { Info as EventProposalAdminDisplayInfo } from './+types/EventProposalAdminDisplay';
import { Info as EventProposalHistoryInfo } from './+types/EventProposalHistory';

function SingleProposalBreadcrumbs() {
  const { t } = useTranslation();

  const eventProposalAdminDisplayData = useRouteLoaderData(NamedRoute.EventProposalAdminDisplay) as
    | EventProposalAdminDisplayInfo['loaderData']
    | undefined;
  const editEventProposalData = useRouteLoaderData(NamedRoute.AdminEditEventProposal) as
    | AdminEditEventProposalInfo['loaderData']
    | undefined;
  const eventProposalHistoryData = useRouteLoaderData(NamedRoute.EventProposalHistory) as
    | EventProposalHistoryInfo['loaderData']
    | undefined;

  const data = eventProposalAdminDisplayData ?? editEventProposalData ?? eventProposalHistoryData;

  return (
    <>
      <NamedRouteBreadcrumbItem routeId={['AdminEventProposal', 'EventProposalAdminDisplay']}>
        {data?.convention.event_proposal.title}
      </NamedRouteBreadcrumbItem>
      <NamedRouteBreadcrumbItem routeId="AdminEditEventProposal">
        {t('navigation.general.edit')}
      </NamedRouteBreadcrumbItem>
      <NamedRouteBreadcrumbItem routeId={['EventProposalHistory']}>
        {t('navigation.general.history')}
      </NamedRouteBreadcrumbItem>
    </>
  );
}

function EventProposalsAdmin(): JSX.Element {
  const { siteMode } = useContext(AppRootContext);
  const { t } = useTranslation();
  const authorizationWarning = useAuthorizationRequired('can_read_event_proposals');

  if (authorizationWarning) return authorizationWarning;
  if (siteMode === SiteMode.SingleEvent) {
    return <FourOhFourPage />;
  }

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

export default EventProposalsAdmin;

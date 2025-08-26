import { useMatches, Outlet, LoaderFunction } from 'react-router';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';
import { useTranslation } from 'react-i18next';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import { NamedRoute } from '../AppRouter';
import { client } from '../useIntercodeApolloClient';
import { UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryDocument } from './queries.generated';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<UserActivityAlertsAdminQueryData>({
    query: UserActivityAlertsAdminQueryDocument,
  });
  return data;
};

function UserActivityAlertsAdmin(): React.JSX.Element {
  const matches = useMatches();
  const { t } = useTranslation();
  const authorizationWarning = useAuthorizationRequired('can_read_user_activity_alerts');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label={t('general.breadcrumbAriaLabel')} className="mb-4">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem to="" end>
            {t('navigation.admin.userActivityAlerts')}
          </RouteActivatedBreadcrumbItem>

          <LeafBreadcrumbItem path="new">{t('buttons.create')}</LeafBreadcrumbItem>

          {matches.some((match) => match.id === NamedRoute.EditUserActivityAlert) && (
            <BreadcrumbItem active>{t('buttons.edit')}</BreadcrumbItem>
          )}
        </ol>
      </nav>

      <Outlet />
    </>
  );
}

export const Component = UserActivityAlertsAdmin;

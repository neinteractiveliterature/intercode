import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { NamedRoute } from '../AppRouter';

function OAuthApplicationAdmin(): React.JSX.Element {
  const { t } = useTranslation();
  const authorizationWarning = useAuthorizationRequired('can_manage_oauth_applications');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label={t('general.breadcrumbAriaLabel')}>
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem to="" end>
            {t('navigation.admin.oauth2Applications')}
          </RouteActivatedBreadcrumbItem>

          <LeafBreadcrumbItem path="new">{t('admin.oauthApplications.newApplication')}</LeafBreadcrumbItem>

          <NamedRouteBreadcrumbItem routeId={NamedRoute.EditOAuthApplication}>
            {t('admin.oauthApplications.editApplication')}
          </NamedRouteBreadcrumbItem>
        </ol>
      </nav>

      <Outlet />
    </>
  );
}

export const Component = OAuthApplicationAdmin;

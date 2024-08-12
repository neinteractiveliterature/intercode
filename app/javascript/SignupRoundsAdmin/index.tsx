import { Outlet } from 'react-router';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import RouteActivatedBreadcrumbItemV2 from '../Breadcrumbs/RouteActivatedBreadcrumbItemV2';
import { useTranslation } from 'react-i18next';

function SignupRoundsAdmin() {
  const { t } = useTranslation();

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem to="/signup_rounds" end>
          {t('navigation.admin.signupRounds')}
        </RouteActivatedBreadcrumbItem>

        <RouteActivatedBreadcrumbItemV2 route={{ path: '/signup_rounds/:id/results' }} to="." hideUnlessMatch>
          {t('signups.signupRounds.results')}
        </RouteActivatedBreadcrumbItemV2>
      </ol>

      <Outlet />
    </>
  );
}

export const Component = SignupRoundsAdmin;

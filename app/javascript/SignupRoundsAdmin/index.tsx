import { Route, Routes } from 'react-router';
import SignupRoundsAdminPage from './SignupRoundsAdminPage';
import RankedChoiceSignupDecisionsPage from './RankedChoiceSignupDecisionsPage';
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
      <Routes>
        <Route path=":id/results" element={<RankedChoiceSignupDecisionsPage />} />
        <Route index element={<SignupRoundsAdminPage />} />
      </Routes>
    </>
  );
}

export default SignupRoundsAdmin;

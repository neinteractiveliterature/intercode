import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EditSignup from './EditSignup';
import SignupsIndex from './SignupsIndex';
import { useSignupAdminEventQuery } from './queries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';

export type SignupAdminProps = {
  runId: string;
  eventId: string;
  eventPath: string;
};

export default LoadQueryWithVariablesWrapper(
  useSignupAdminEventQuery,
  ({ eventId }: SignupAdminProps) => ({ eventId }),
  function SignupAdmin({ data, runId, eventId, eventPath }) {
    const { t } = useTranslation();
    const location = useLocation();
    const runPath = `${eventPath}/runs/${runId}`;

    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <BreadcrumbItem to={eventPath}>{data.convention.event.title}</BreadcrumbItem>
            <BreadcrumbItem
              active={!location.pathname.endsWith('edit')}
              to={`${runPath}/admin_signups?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}
            >
              {t('events.signupAdmin.title', 'Signups')}
            </BreadcrumbItem>
            <Route path={`${runPath}/admin_signups/:id/edit`}>
              <BreadcrumbItem active to={`${runPath}/admin_signups/:id/edit`}>
                {t('events.signupAdmin.editTitle', 'Edit signup')}
              </BreadcrumbItem>
            </Route>
          </ol>
        </nav>

        <Routes>
          <Route
            path={`${runPath}/admin_signups/:id/edit`}
            element={<EditSignup teamMembersUrl={`${eventPath}/team_members`} />}
          />
          <Route
            path={`${runPath}/admin_signups`}
            element={<SignupsIndex runId={runId} eventId={eventId} runPath={runPath} />}
          />
        </Routes>
      </div>
    );
  },
);

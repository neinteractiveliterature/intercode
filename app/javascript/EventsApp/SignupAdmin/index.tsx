import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EditSignup from './EditSignup';
import SignupsIndex from './SignupsIndex';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform/dist';
import buildEventUrl from '../buildEventUrl';
import LeafBreadcrumbItem from '../../Breadcrumbs/LeafBreadcrumbItem';
import { useSignupAdminEventQueryFromParams } from './useSignupAdminEventQueryFromParams';
import RunEmailList from './RunEmailList';
import RunSignupChangesTable from './RunSignupChangesTable';
import RunSignupsTable from './RunSignupsTable';

export type SignupAdminProps = {
  runId: string;
  eventId: string;
  eventPath: string;
};

export default LoadQueryWrapper(useSignupAdminEventQueryFromParams, function SignupAdmin({ data }) {
  const { runId } = useParams();
  const { t } = useTranslation();
  const location = useLocation();
  const eventPath = buildEventUrl(data.convention.event);
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
            {t('events.signupAdmin.title')}
          </BreadcrumbItem>
          <LeafBreadcrumbItem path={`${runPath}/admin_signups/:id/edit`}>
            {t('events.signupAdmin.editTitle')}
          </LeafBreadcrumbItem>
        </ol>
      </nav>
      <Routes>
        <Route path=":id/edit" element={<EditSignup teamMembersUrl={`${eventPath}/team_members`} />} />
        <Route element={<SignupsIndex runPath={runPath} />}>
          <Route path="emails/comma" element={<RunEmailList separator=", " />} />
          <Route
            path="emails/semicolon"
            element={
              <>
                <div className="alert alert-warning mb-2">
                  <Trans i18nKey="events.signupAdmin.emailsSemicolonWarning">
                    <strong>Note:</strong> Most email apps use comma-separated address lists. Only Outlook uses
                    semicolon-separated address lists. If you’re not using Outlook, try comma-separated first.
                  </Trans>
                </div>
                <RunEmailList separator="; " />
              </>
            }
          />
          <Route path="signup_changes" element={<RunSignupChangesTable />} />
          <Route
            path=""
            element={
              <RunSignupsTable
                defaultVisibleColumns={['id', 'state', 'name', 'bucket', 'age_restrictions_check', 'email']}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
});

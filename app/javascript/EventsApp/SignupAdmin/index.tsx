import { Route, Switch, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EditSignup from './EditSignup';
import SignupsIndex from './SignupsIndex';
import { useSignupAdminEventQuery } from './queries.generated';

export type SignupAdminProps = {
  runId: number;
  eventId: number;
  eventPath: string;
};

function SignupAdmin({ runId, eventId, eventPath }: SignupAdminProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { data, loading, error } = useSignupAdminEventQuery({ variables: { eventId } });
  const runPath = `${eventPath}/runs/${runId}`;

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItem to={eventPath}>{data!.event.title}</BreadcrumbItem>
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

      <Switch>
        <Route path={`${runPath}/admin_signups/:id/edit`}>
          <EditSignup teamMembersUrl={`${eventPath}/team_members`} />
        </Route>
        <Route path={`${runPath}/admin_signups`}>
          <SignupsIndex runId={runId} eventId={eventId} runPath={runPath} />
        </Route>
      </Switch>
    </div>
  );
}

export default SignupAdmin;

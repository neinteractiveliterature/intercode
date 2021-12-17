import { NavLink, Routes, Route, useMatch } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import RunEmailList from './RunEmailList';
import RunHeader from './RunHeader';
import RunSignupsTable from './RunSignupsTable';
import RunSignupChangesTable from './RunSignupChangesTable';
import classNames from 'classnames';

export type SignupsIndexProps = {
  runId: string;
  eventId: string;
  runPath: string;
};

function SignupsIndex({ runId, eventId, runPath }: SignupsIndexProps): JSX.Element {
  const { t } = useTranslation();
  const signupsTabMatch = useMatch({ path: `${runPath}/admin_signups`, end: true });
  const signupChangesTabMatch = useMatch({ path: `${runPath}/admin_signups/signup_changes` });

  return (
    <>
      <RunHeader runId={runId} eventId={eventId} />
      <ul className="nav nav-tabs mb-2">
        <li className="nav-item">
          <NavLink
            to={`${runPath}/admin_signups/?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}
            className={({ isActive }) => classNames('nav-link', { active: isActive || signupsTabMatch })}
          >
            {t('events.signupsAdmin.title', 'Signups')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to={`${runPath}/admin_signups/signup_changes?sort.created_at=asc`}
            className={({ isActive }) => classNames('nav-link', { active: isActive || signupChangesTabMatch })}
          >
            {t('events.signupsAdmin.historyTitle', 'Change history')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={`${runPath}/admin_signups/emails/comma`} className="nav-link">
            {t('events.signupsAdmin.emailsCommaTitle', 'Emails (comma-separated)')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={`${runPath}/admin_signups/emails/semicolon`} className="nav-link">
            {t('events.signupsAdmin.emailsSemicolonTitle', 'Emails (semicolon-separated)')}
          </NavLink>
        </li>
      </ul>
      <Routes>
        <Route
          path={`${runPath}/admin_signups/emails/comma`}
          element={<RunEmailList runId={runId} eventId={eventId} separator=", " />}
        />
        <Route
          path={`${runPath}/admin_signups/emails/semicolon`}
          element={
            <>
              <div className="alert alert-warning mb-2">
                <Trans i18nKey="events.signupsAdmin.emailsSemicolonWarning">
                  <strong>Note:</strong> Most email apps use comma-separated address lists. Only Outlook uses
                  semicolon-separated address lists. If you’re not using Outlook, try comma-separated first.
                </Trans>
              </div>
              <RunEmailList runId={runId} eventId={eventId} separator="; " />
            </>
          }
        />
        <Route path={`${runPath}/admin_signups/signup_changes`} element={<RunSignupChangesTable runId={runId} />} />
        <Route
          path={`${runPath}/admin_signups`}
          element={
            <RunSignupsTable
              runId={runId}
              eventId={eventId}
              runPath={runPath}
              defaultVisibleColumns={['id', 'state', 'name', 'bucket', 'age_restrictions_check', 'email']}
            />
          }
        />
      </Routes>
    </>
  );
}

export default SignupsIndex;

import React from 'react';
import PropTypes from 'prop-types';
import {
  NavLink,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import RunEmailList from './RunEmailList';
import RunHeader from './RunHeader';
import RunSignupsTable from './RunSignupsTable';
import RunSignupChangesTable from './RunSignupChangesTable';

function SignupsIndex({
  runId, eventId, runPath,
}) {
  const { t } = useTranslation();
  const signupsTabMatch = useRouteMatch({ path: `${runPath}/admin_signups`, exact: true });
  const signupChangesTabMatch = useRouteMatch({ path: `${runPath}/admin_signups/signup_changes` });

  return (
    <>
      <RunHeader runId={runId} eventId={eventId} />
      <ul className="nav nav-tabs mb-2">
        <li className="nav-item">
          <NavLink
            to={`${runPath}/admin_signups/?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}
            isActive={() => signupsTabMatch != null}
            className="nav-link"
          >
            {t('events.signupsAdmin.title', 'Signups')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to={`${runPath}/admin_signups/signup_changes?sort.created_at=asc`}
            isActive={() => signupChangesTabMatch != null}
            className="nav-link"
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
      <Switch>
        <Route path={`${runPath}/admin_signups/emails/comma`}>
          <RunEmailList runId={runId} eventId={eventId} separator=", " />
        </Route>
        <Route path={`${runPath}/admin_signups/emails/semicolon`}>
          <div className="alert alert-warning mb-2">
            <Trans i18nKey="events.signupsAdmin.emailsSemicolonWarning">
              <strong>Note:</strong>
              {' '}
              Most email apps use comma-separated address lists.  Only Outlook uses
              semicolon-separated address lists.  If you’re not using Outlook, try
              comma-separated first.
            </Trans>
          </div>
          <RunEmailList runId={runId} eventId={eventId} separator="; " />
        </Route>
        <Route path={`${runPath}/admin_signups/signup_changes`} exact>
          <RunSignupChangesTable runId={runId} />
        </Route>
        <Route path={`${runPath}/admin_signups`} exact>
          <RunSignupsTable
            runId={runId}
            eventId={eventId}
            runPath={runPath}
            defaultVisibleColumns={['id', 'state', 'name', 'bucket', 'age_restrictions_check', 'email']}
          />
        </Route>
        <Redirect to={`${runPath}/admin_signups`} />
      </Switch>
    </>
  );
}

SignupsIndex.propTypes = {
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  runPath: PropTypes.string.isRequired,
};

export default SignupsIndex;

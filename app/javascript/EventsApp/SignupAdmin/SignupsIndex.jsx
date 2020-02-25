import React from 'react';
import PropTypes from 'prop-types';
import {
  NavLink,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import RunEmailList from './RunEmailList';
import RunHeader from './RunHeader';
import RunSignupsTable from './RunSignupsTable';

function SignupsIndex({
  runId, eventId, runPath, exportSignupsUrl,
}) {
  return (
    <>
      <RunHeader runId={runId} eventId={eventId} />
      <ul className="nav nav-tabs mb-2">
        <li className="nav-item">
          <NavLink
            to={`${runPath}/admin_signups/?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}
            isActive={(match, location) => !location.pathname.endsWith('/comma') && !location.pathname.endsWith('/semicolon')}
            className="nav-link"
          >
            Signups
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={`${runPath}/admin_signups/emails/comma`} className="nav-link">Emails (comma-separated)</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={`${runPath}/admin_signups/emails/semicolon`} className="nav-link">Emails (semicolon-separated)</NavLink>
        </li>
      </ul>
      <Switch>
        <Route path={`${runPath}/admin_signups/emails/comma`}>
          <RunEmailList runId={runId} eventId={eventId} separator=", " />
        </Route>
        <Route path={`${runPath}/admin_signups/emails/semicolon`}>
          <div className="alert alert-warning mb-2">
            <strong>Note:</strong>
            {' '}
            Most email apps use comma-separated address lists.  Only Outlook uses
            semicolon-separated address lists.  If you&rsquo;re not using Outlook, try
            comma-separated first.
          </div>
          <RunEmailList runId={runId} eventId={eventId} separator="; " />
        </Route>
        <Route path={`${runPath}/admin_signups`} exact>
          <RunSignupsTable
            runId={runId}
            eventId={eventId}
            exportUrl={exportSignupsUrl}
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
  exportSignupsUrl: PropTypes.string.isRequired,
  runPath: PropTypes.string.isRequired,
};

export default SignupsIndex;

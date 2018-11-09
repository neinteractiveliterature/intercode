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

function SignupsIndex({ runId, eventId, exportSignupsUrl }) {
  return (
    <>
      <RunHeader runId={runId} eventId={eventId} />
      <ul className="nav nav-tabs mb-2">
        <li className="nav-item">
          <NavLink
            to="/?filters.state=confirmed%2Cwaitlisted&sort.id=asc"
            isActive={(match, location) => location.pathname === '/'}
            className="nav-link"
          >
            Signups
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/emails/comma" className="nav-link">Emails (comma-separated)</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/emails/semicolon" className="nav-link">Emails (semicolon-separated)</NavLink>
        </li>
      </ul>
      <Switch>
        <Route
          path="/emails/comma"
          render={() => (
            <RunEmailList
              runId={runId}
              eventId={eventId}
              separator=", "
            />
          )}
        />
        <Route
          path="/emails/semicolon"
          render={() => (
            <>
              <div className="alert alert-warning mb-2">
                <strong>Note:</strong>
                {' '}
                Most email apps use comma-separated address lists.  Only Outlook uses
                semicolon-separated address lists.  If you&apos;re not using Outlook, try
                comma-separated first.
              </div>
              <RunEmailList
                runId={runId}
                eventId={eventId}
                separator="; "
              />
            </>
          )}
        />
        <Route
          path="/"
          exact
          render={() => (
            <RunSignupsTable
              runId={runId}
              eventId={eventId}
              exportUrl={exportSignupsUrl}
              defaultVisibleColumns={['id', 'state', 'name', 'bucket', 'age', 'email']}
            />
          )}
        />
        <Redirect to="/" />
      </Switch>
    </>
  );
}

SignupsIndex.propTypes = {
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  exportSignupsUrl: PropTypes.string.isRequired,
};

export default SignupsIndex;

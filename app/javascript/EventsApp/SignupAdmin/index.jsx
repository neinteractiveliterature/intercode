import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EditSignup from './EditSignup';
import eventIdRegexp from '../eventIdRegexp';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';
import SignupsIndex from './SignupsIndex';
import { SignupAdminEventQuery } from './queries.gql';

const SignupAdmin = ({
  runId,
  eventId,
  eventPath,
}) => {
  const runPath = `${eventPath}/runs/${runId}`;
  return (
    <div>
      <QueryWithStateDisplay query={SignupAdminEventQuery} variables={{ eventId }}>
        {({ data }) => (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <BreadcrumbItem to={eventPath}>
                {data.event.title}
              </BreadcrumbItem>
              <Route path={`${runPath}/admin_signups`}>
                {({ location }) => (
                  <BreadcrumbItem
                    active={location.pathname.endsWith('admin_signups')}
                    to={`${runPath}/admin_signups?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}
                  >
                    Signups
                  </BreadcrumbItem>
                )}
              </Route>
              <Route
                path={`${runPath}/admin_signups/:id/edit`}
                render={() => (
                  <li className="breadcrumb-item active">
                    Edit signup
                  </li>
                )}
              />
            </ol>
          </nav>
        )}
      </QueryWithStateDisplay>

      <Switch>
        <Route
          path={`${runPath}/admin_signups/:id/edit`}
          render={({ match }) => (
            <EditSignup
              id={Number.parseInt(match.params.id, 10)}
              teamMembersUrl={`/events${runPath}/team_members`}
            />
          )}
        />
        <Route
          path={`${runPath}/admin_signups`}
          render={() => (
            <SignupsIndex
              runId={runId}
              eventId={eventId}
              runPath={runPath}
              exportSignupsUrl={`/events${runPath}/admin_signups/export.csv`}
            />
          )}
        />
      </Switch>
    </div>
  );
};

SignupAdmin.propTypes = {
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default SignupAdmin;

import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import BreadcrumbItemWithRoute from '../../Breadcrumbs/BreadcrumbItemWithRoute';
import EditSignup from './EditSignup';
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
                    pageTitleIfActive={`Signups - ${data.event.title} - ${data.convention.name}`}
                  >
                    Signups
                  </BreadcrumbItem>
                )}
              </Route>
              <BreadcrumbItemWithRoute
                path={`${runPath}/admin_signups/:id/edit`}
                pageTitleIfActive={`Edit signup - ${data.event.title} - ${data.convention.name}`}
                to={({ match }) => `${runPath}/admin_signups/${match.params.id}/edit`}
                hideUnlessMatch
              >
                Edit signup
              </BreadcrumbItemWithRoute>
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
              teamMembersUrl={`${eventPath}/team_members`}
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
              exportSignupsUrl={`${runPath}/admin_signups/export.csv`}
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

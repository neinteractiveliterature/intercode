import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EditSignup from './EditSignup';
import SignupsIndex from './SignupsIndex';
import { SignupAdminEventQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function SignupAdmin({ runId, eventId, eventPath }) {
  const location = useLocation();
  const { data, loading, error } = useQuery(SignupAdminEventQuery, { variables: { eventId } });
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
          <BreadcrumbItem to={eventPath}>
            {data.event.title}
          </BreadcrumbItem>
          <BreadcrumbItem
            active={!location.pathname.endsWith('edit')}
            to={`${runPath}/admin_signups?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}
          >
            Signups
          </BreadcrumbItem>
          <Route path={`${runPath}/admin_signups/:id/edit`}>
            <BreadcrumbItem active>Edit signup</BreadcrumbItem>
          </Route>
        </ol>
      </nav>

      <Switch>
        <Route path={`${runPath}/admin_signups/:id/edit`}>
          <EditSignup teamMembersUrl={`${eventPath}/team_members`} />
        </Route>
        <Route path={`${runPath}/admin_signups`}>
          <SignupsIndex
            runId={runId}
            eventId={eventId}
            runPath={runPath}
            exportSignupsUrl={`${runPath}/admin_signups/export.csv`}
          />
        </Route>
      </Switch>
    </div>
  );
}

SignupAdmin.propTypes = {
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default SignupAdmin;

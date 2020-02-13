import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link } from 'react-router-dom';
import { humanize, underscore, pluralize } from 'inflected';
import { useQuery } from 'react-apollo-hooks';

import BreadcrumbItemWithRoute from '../../Breadcrumbs/BreadcrumbItemWithRoute';
import EditTeamMember from './EditTeamMember';
import NewTeamMember from './NewTeamMember';
import TeamMembersIndex from './TeamMembersIndex';
import { TeamMembersQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function TeamMemberAdmin({ eventId, eventPath }) {
  const { data, loading, error } = useQuery(TeamMembersQuery, { variables: { eventId } });

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { event } = data;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={eventPath}>
              {event.title}
            </Link>
          </li>
          <BreadcrumbItemWithRoute
            path={`${eventPath}/team_members`}
            to={`${eventPath}/team_members`}
            exact
          >
            {pluralize(humanize(underscore(event.event_category.team_member_name)))}
          </BreadcrumbItemWithRoute>
          <BreadcrumbItemWithRoute
            path={`${eventPath}/team_members/new`}
            to={`${eventPath}/team_members/new`}
            hideUnlessMatch
          >
            {'Add '}
            {event.event_category.team_member_name}
          </BreadcrumbItemWithRoute>
          <BreadcrumbItemWithRoute
            path={`${eventPath}/team_members/:teamMemberId(\\d+)`}
            to={`${eventPath}/team_members/:teamMemberId(\\d+)`}
            hideUnlessMatch
          >
            {({ match }) => event.team_members
              .find((teamMember) => teamMember.id.toString() === match.params.teamMemberId)
              .user_con_profile
              .name_without_nickname}
          </BreadcrumbItemWithRoute>
        </ol>
      </nav>
      <Switch>
        <Route
          path={`${eventPath}/team_members/new`}
          render={({ history }) => (
            <NewTeamMember
              event={event}
              eventPath={eventPath}
              history={history}
            />
          )}
        />
        <Route
          path={`${eventPath}/team_members/:teamMemberId(\\d+)`}
          render={({ match, history }) => (
            <EditTeamMember
              event={event}
              eventPath={eventPath}
              teamMemberId={Number.parseInt(match.params.teamMemberId, 10)}
              history={history}
            />
          )}
        />
        <Route
          path={`${eventPath}/team_members`}
          render={() => <TeamMembersIndex eventId={eventId} eventPath={eventPath} />}
        />
      </Switch>
    </>
  );
}

TeamMemberAdmin.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default TeamMemberAdmin;

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link } from 'react-router-dom';
import { humanize, underscore, pluralize } from 'inflected';

import BreadcrumbItemWithRoute from '../../Breadcrumbs/BreadcrumbItemWithRoute';
import EditTeamMember from './EditTeamMember';
import NewTeamMember from './NewTeamMember';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';
import TeamMembersIndex from './TeamMembersIndex';
import { TeamMembersQuery } from './queries.gql';

function TeamMemberAdmin({ eventId, eventPath }) {
  return (
    <QueryWithStateDisplay query={TeamMembersQuery} variables={{ eventId }}>
      {({ data: { event, convention } }) => (
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
                pageTitleIfActive={`${pluralize(humanize(underscore(event.team_member_name)))} - ${event.title} - ${convention.name}`}
                exact
              >
                {pluralize(humanize(underscore(event.team_member_name)))}
              </BreadcrumbItemWithRoute>
              <BreadcrumbItemWithRoute
                path={`${eventPath}/team_members/new`}
                to={`${eventPath}/team_members/new`}
                pageTitleIfActive={`Add ${event.team_member_name} - ${event.title} - ${convention.name}`}
                hideUnlessMatch
              >
                {'Add '}
                {event.team_member_name}
              </BreadcrumbItemWithRoute>
              <BreadcrumbItemWithRoute
                path={`${eventPath}/team_members/:teamMemberId(\\d+)`}
                to={`${eventPath}/team_members/:teamMemberId(\\d+)`}
                pageTitleIfActive={`Edit ${event.team_member_name} - ${event.title} - ${convention.name}`}
                hideUnlessMatch
              >
                {({ match }) => event.team_members
                  .find(teamMember => teamMember.id.toString() === match.params.teamMemberId)
                  .user_con_profile
                  .name_without_nickname
                }
              </BreadcrumbItemWithRoute>
            </ol>
          </nav>
          <Switch>
            <Route
              path={`${eventPath}/team_members/new`}
              render={() => <NewTeamMember event={event} eventPath={eventPath} />}
            />
            <Route
              path={`${eventPath}/team_members/:teamMemberId(\\d+)`}
              render={({ match }) => (
                <EditTeamMember
                  event={event}
                  eventPath={eventPath}
                  teamMemberId={Number.parseInt(match.params.teamMemberId, 10)}
                />
              )}
            />
            <Route
              path={`${eventPath}/team_members`}
              render={() => <TeamMembersIndex eventId={eventId} eventPath={eventPath} />}
            />
          </Switch>
        </>
      )}
    </QueryWithStateDisplay>
  );
}

TeamMemberAdmin.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default TeamMemberAdmin;

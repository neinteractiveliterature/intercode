import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Link, useRouteMatch,
} from 'react-router-dom';
import { humanize, underscore, pluralize } from 'inflected';
import { useQuery } from '@apollo/react-hooks';

import BreadcrumbItemWithRoute from '../../Breadcrumbs/BreadcrumbItemWithRoute';
import EditTeamMember from './EditTeamMember';
import NewTeamMember from './NewTeamMember';
import TeamMembersIndex from './TeamMembersIndex';
import { TeamMembersQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function TeamMemberAdmin({ eventId, eventPath }) {
  const { data, loading, error } = useQuery(TeamMembersQuery, { variables: { eventId } });
  const teamMemberMatch = useRouteMatch(`${eventPath}/team_members/:teamMemberId(\\d+)`);

  const teamMember = useMemo(
    () => {
      if (loading || error || !teamMemberMatch) {
        return null;
      }

      return data.event.team_members
        .find((tm) => tm.id.toString() === teamMemberMatch.params.teamMemberId);
    },
    [data, error, loading, teamMemberMatch],
  );

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
            { /* eslint-disable-next-line camelcase */ }
            {teamMember?.user_con_profile?.name_without_nickname || ''}
          </BreadcrumbItemWithRoute>
        </ol>
      </nav>
      <Switch>
        <Route path={`${eventPath}/team_members/new`}>
          <NewTeamMember event={event} eventPath={eventPath} />
        </Route>
        <Route path={`${eventPath}/team_members/:teamMemberId(\\d+)`}>
          <EditTeamMember event={event} eventPath={eventPath} />
        </Route>
        <Route path={`${eventPath}/team_members`}>
          <TeamMembersIndex eventId={eventId} eventPath={eventPath} />
        </Route>
      </Switch>
    </>
  );
}

TeamMemberAdmin.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default TeamMemberAdmin;

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { humanize, underscore, pluralize } from 'inflected';
import { useQuery } from '@apollo/react-hooks';

import EditTeamMember from './EditTeamMember';
import NewTeamMember from './NewTeamMember';
import TeamMembersIndex from './TeamMembersIndex';
import { TeamMembersQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';

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
          <BreadcrumbItem active={false} to={eventPath}>
            {event.title}
          </BreadcrumbItem>
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: `${eventPath}/team_members`, exact: true }}
            to={`${eventPath}/team_members`}
          >
            {pluralize(humanize(underscore(event.event_category.team_member_name)))}
          </RouteActivatedBreadcrumbItem>
          <Route path={`${eventPath}/team_members/new`}>
            <BreadcrumbItem active>
              {'Add '}
              {event.event_category.team_member_name}
            </BreadcrumbItem>
          </Route>
          <Route path={`${eventPath}/team_members/:teamMemberId(\\d+)`}>
            <BreadcrumbItem active>
              {teamMember?.user_con_profile?.name_without_nickname || ''}
            </BreadcrumbItem>
          </Route>
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

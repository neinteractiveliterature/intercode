import { useMemo } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';
import snakeCase from 'lodash/snakeCase';

import EditTeamMember from './EditTeamMember';
import NewTeamMember from './NewTeamMember';
import TeamMembersIndex from './TeamMembersIndex';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import { useTeamMembersQuery } from './queries.generated';
import FourOhFourPage from '../../FourOhFourPage';
import humanize from '../../humanize';

export type TeamMemberAdminProps = {
  eventId: string;
  eventPath: string;
};

function TeamMemberAdmin({ eventId, eventPath }: TeamMemberAdminProps): JSX.Element {
  const { data, loading, error } = useTeamMembersQuery({ variables: { eventId } });
  const teamMemberMatch = useRouteMatch<{ teamMemberId: string }>(`${eventPath}/team_members/:teamMemberId(\\d+)`);

  const teamMember = useMemo(() => {
    if (loading || error || !teamMemberMatch || !data) {
      return null;
    }

    return data.convention.event.team_members.find((tm) => tm.id.toString() === teamMemberMatch.params.teamMemberId);
  }, [data, error, loading, teamMemberMatch]);

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data) {
    return <FourOhFourPage />;
  }

  const { event } = data.convention;

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
            {humanize(snakeCase(event.event_category.teamMemberNamePlural))}
          </RouteActivatedBreadcrumbItem>
          <Route path={`${eventPath}/team_members/new`}>
            <BreadcrumbItem active to={`${eventPath}/team_members/new`}>
              {'Add '}
              {event.event_category.team_member_name}
            </BreadcrumbItem>
          </Route>
          <Route path={`${eventPath}/team_members/:teamMemberId(\\d+)`}>
            <BreadcrumbItem active to={`${eventPath}/team_members/${teamMemberMatch?.params.teamMemberId}`}>
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

export default TeamMemberAdmin;

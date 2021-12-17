import { useMemo } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
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
  const teamMemberId = useParams<{ teamMemberId: string }>().teamMemberId;

  const teamMember = useMemo(() => {
    if (loading || error || !teamMemberId || !data) {
      return null;
    }

    return data.convention.event.team_members.find((tm) => tm.id.toString() === teamMemberId);
  }, [data, error, loading, teamMemberId]);

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
            pattern={{ path: `${eventPath}/team_members`, end: true }}
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
            <BreadcrumbItem active to={`${eventPath}/team_members/${teamMemberId}`}>
              {teamMember?.user_con_profile?.name_without_nickname || ''}
            </BreadcrumbItem>
          </Route>
        </ol>
      </nav>
      <Routes>
        <Route path={`${eventPath}/team_members/new`} element={<NewTeamMember event={event} eventPath={eventPath} />} />
        <Route
          path={`${eventPath}/team_members/:teamMemberId(\\d+)`}
          element={<EditTeamMember event={event} eventPath={eventPath} />}
        />
        <Route
          path={`${eventPath}/team_members`}
          element={<TeamMembersIndex eventId={eventId} eventPath={eventPath} />}
        />
      </Routes>
    </>
  );
}

export default TeamMemberAdmin;

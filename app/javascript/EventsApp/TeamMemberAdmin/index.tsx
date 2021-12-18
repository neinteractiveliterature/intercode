import { useMemo } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import buildEventUrl from '../buildEventUrl';
import LeafBreadcrumbItem from '../../Breadcrumbs/LeafBreadcrumbItem';
import useTeamMembersQueryFromParams from './useTeamMembersQueryFromParams';

export default LoadQueryWrapper(useTeamMembersQueryFromParams, function TeamMemberAdmin({ data }): JSX.Element {
  const teamMemberId = useParams<{ teamMemberId: string }>().teamMemberId;

  const teamMember = useMemo(() => {
    if (!teamMemberId) {
      return null;
    }

    return data.convention.event.team_members.find((tm) => tm.id.toString() === teamMemberId);
  }, [data.convention.event.team_members, teamMemberId]);

  const { event } = data.convention;
  const eventPath = buildEventUrl(event);

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
            {event.event_category.teamMemberNamePlural}
          </RouteActivatedBreadcrumbItem>
          <LeafBreadcrumbItem path={`${eventPath}/team_members/new`}>
            {'Add '}
            {event.event_category.team_member_name}
          </LeafBreadcrumbItem>
          <LeafBreadcrumbItem path={`${eventPath}/team_members/:teamMemberId`}>
            {teamMember?.user_con_profile?.name_without_nickname || ''}
          </LeafBreadcrumbItem>
        </ol>
      </nav>

      <Outlet />
    </>
  );
});

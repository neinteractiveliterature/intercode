import { Suspense, useMemo } from 'react';
import { useParams, Outlet } from 'react-router';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { useTeamMembersLoader } from './loader';
import NamedRouteBreadcrumbItem from '../../Breadcrumbs/NamedRouteBreadcrumbItem';

function TeamMemberAdmin(): JSX.Element {
  const data = useTeamMembersLoader();
  const teamMemberId = useParams<{ teamMemberId: string }>().teamMemberId;

  const teamMember = useMemo(() => {
    if (!teamMemberId) {
      return null;
    }

    return data.convention.event.team_members.find((tm) => tm.id.toString() === teamMemberId);
  }, [data.convention.event.team_members, teamMemberId]);

  const { event } = data.convention;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <NamedRouteBreadcrumbItem routeId="Event">{event.title}</NamedRouteBreadcrumbItem>
          <NamedRouteBreadcrumbItem routeId={['TeamMembers', 'TeamMembersIndex']}>
            {event.event_category.teamMemberNamePlural}
          </NamedRouteBreadcrumbItem>
          <NamedRouteBreadcrumbItem routeId="NewTeamMember">
            {'Add '}
            {event.event_category.team_member_name}
          </NamedRouteBreadcrumbItem>
          <NamedRouteBreadcrumbItem routeId="EditTeamMember">
            {teamMember?.user_con_profile?.name_without_nickname || ''}
          </NamedRouteBreadcrumbItem>
        </ol>
      </nav>

      <Suspense fallback={<PageLoadingIndicator visible />}>
        <Outlet />
      </Suspense>
    </>
  );
}

export default TeamMemberAdmin;

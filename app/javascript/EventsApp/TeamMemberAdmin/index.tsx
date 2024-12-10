import { Suspense, useMemo } from 'react';
import { Outlet, useRouteLoaderData } from 'react-router';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import NamedRouteBreadcrumbItem from '../../Breadcrumbs/NamedRouteBreadcrumbItem';
import { Route } from './+types/index';
import { TeamMembersQueryDocument } from './queries.generated';
import { NamedRoute } from 'routes';
import capitalize from 'lodash/capitalize';

export async function loader({ params: { eventId }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query({
    query: TeamMembersQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
}

export function useTeamMembersLoader() {
  return useRouteLoaderData(NamedRoute.TeamMembers) as Route.ComponentProps['loaderData'];
}

function TeamMemberAdmin({ loaderData: data, params: { teamMemberId } }: Route.ComponentProps): JSX.Element {
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
            {capitalize(event.event_category.teamMemberNamePlural)}
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

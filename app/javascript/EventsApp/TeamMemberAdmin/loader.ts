import { useRouteLoaderData } from 'react-router';
import { TeamMembersQueryData, TeamMembersQueryDocument } from './queries.generated';
import { apolloClientContext } from '~/AppContexts';
import { NamedRoute } from '../../AppRouter';
import { Route } from './+types/route';
import { Route as EditTeamMemberRoute } from './+types/EditTeamMember';

export const teamMembersLoader = async ({ context, params: { eventId } }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: TeamMembersQueryDocument, variables: { eventId: eventId ?? '' } });
  return data;
};

export function useTeamMembersLoader() {
  return useRouteLoaderData(NamedRoute.TeamMembers) as TeamMembersQueryData;
}

export type SingleTeamMemberLoaderResult = {
  data: TeamMembersQueryData;
  teamMember: TeamMembersQueryData['convention']['event']['team_members'][number];
};

export const singleTeamMemberLoader = async ({
  params: { eventId, teamMemberId },
  context,
}: EditTeamMemberRoute.ClientLoaderArgs) => {
  const data = await teamMembersLoader({ params: { eventId }, context });
  const teamMember = data?.convention.event.team_members.find((teamMember) => teamMember.id === teamMemberId);
  if (!teamMember) {
    throw new Response(null, { status: 404 });
  }

  return { data, teamMember } satisfies SingleTeamMemberLoaderResult;
};

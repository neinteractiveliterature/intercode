import { LoaderFunctionArgs } from 'react-router';
import { TeamMembersQueryData, TeamMembersQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import { NamedRoute } from '../../NamedRoute';
import useRequiredRouteLoaderData from '../../useRequiredRouteLoaderData';

export const teamMembersLoader = async ({ context, params: { eventId } }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: TeamMembersQueryDocument,
    variables: { eventId: eventId ?? '' },
    errorPolicy: 'none',
  });
  return data;
};

export function useTeamMembersLoader() {
  return useRequiredRouteLoaderData<typeof teamMembersLoader>(NamedRoute.TeamMembers);
}

export const singleTeamMemberLoader = async ({ params: { eventId, teamMemberId }, ...args }: LoaderFunctionArgs) => {
  const data = (await teamMembersLoader({ params: { eventId }, ...args })) as TeamMembersQueryData;
  const teamMember = data.convention.event.team_members.find((teamMember) => teamMember.id === teamMemberId);
  if (!teamMember) {
    throw new Response(null, { status: 404 });
  }

  return { data, teamMember };
};

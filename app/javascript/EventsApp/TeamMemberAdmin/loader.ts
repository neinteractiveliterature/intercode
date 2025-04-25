import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { TeamMembersQueryData, TeamMembersQueryDocument } from './queries.generated';
import { client } from '../../useIntercodeApolloClient';
import { NamedRoute } from '../../AppRouter';

export const teamMembersLoader: LoaderFunction = async ({ params: { eventId } }) => {
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

export const singleTeamMemberLoader: LoaderFunction = async ({ params: { eventId, teamMemberId }, ...args }) => {
  const data = (await teamMembersLoader({ params: { eventId }, ...args })) as TeamMembersQueryData;
  const teamMember = data.convention.event.team_members.find((teamMember) => teamMember.id === teamMemberId);
  if (!teamMember) {
    throw new Response(null, { status: 404 });
  }

  return { data, teamMember } satisfies SingleTeamMemberLoaderResult;
};

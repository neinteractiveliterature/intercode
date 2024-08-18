import { LoaderFunction, useRouteLoaderData } from 'react-router-dom';
import { TeamMembersQueryData, TeamMembersQueryDocument, TeamMembersQueryVariables } from './queries.generated';
import { client } from '../../useIntercodeApolloClient';
import { NamedRoute } from '../../AppRouter';

export const teamMembersLoader: LoaderFunction = async ({ params: { eventId } }) => {
  const { data } = await client.query<TeamMembersQueryData, TeamMembersQueryVariables>({
    query: TeamMembersQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

export function useTeamMembersLoader() {
  return useRouteLoaderData(NamedRoute.TeamMembers) as TeamMembersQueryData;
}

import { buildServerApolloClient } from 'serverApolloClient.server';
import * as Route from './+types.route';
import { SignupAdminEventQueryDocument } from './queries.generated';

export const loader = async ({ request, params: { eventId } }: Route.LoaderArgs) => {
  const client = buildServerApolloClient(request);
  const { data } = await client.query({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

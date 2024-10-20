import * as Route from './+types.route';
import { SignupAdminEventQueryDocument } from './queries.generated';

export const loader = async ({ params: { eventId }, context }: Route.LoaderArgs) => {
  const client = context!.client;
  const { data } = await client.query({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

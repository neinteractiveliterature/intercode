import { apolloClientContext } from 'AppContexts';
import { Route } from './+types/route';
import { SignupAdminEventQueryDocument } from './queries.generated';

export const loader = async ({ params: { eventId }, context }: Route.LoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

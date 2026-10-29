import { redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { RestoreDroppedEventDocument } from './mutations.generated';
import { EventAdminEventsQueryDocument } from './queries.generated';
import type { Route } from './+types/RestoreEventRoute';

export const clientAction = async ({ params: { eventId }, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    await client.mutate({
      mutation: RestoreDroppedEventDocument,
      variables: {
        input: {
          id: eventId ?? '',
        },
      },
      refetchQueries: [{ query: EventAdminEventsQueryDocument }],
      awaitRefetchQueries: true,
    });
    return redirect('/admin_events/dropped_events');
  } catch (error) {
    return error;
  }
};

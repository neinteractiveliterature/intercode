import { redirect } from 'react-router';
import { RestoreDroppedEventDocument } from './mutations.generated';
import { Route } from './+types/RestoreEventRoute';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { eventId }, context }: Route.ActionArgs) {
  try {
    await context.get(apolloClientContext).mutate({
      mutation: RestoreDroppedEventDocument,
      variables: {
        input: {
          id: eventId ?? '',
        },
      },
    });
    await context.get(apolloClientContext).resetStore();
    return redirect('/admin_events/dropped_events');
  } catch (error) {
    return error;
  }
}

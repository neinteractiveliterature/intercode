import { redirect } from 'react-router';
import { RestoreDroppedEventDocument } from './mutations.generated';
import { Route } from './+types/RestoreEventRoute';

export async function action({ params: { eventId }, context }: Route.ActionArgs) {
  try {
    await context.client.mutate({
      mutation: RestoreDroppedEventDocument,
      variables: {
        input: {
          id: eventId ?? '',
        },
      },
    });
    await context.client.resetStore();
    return redirect('/admin_events/dropped_events');
  } catch (error) {
    return error;
  }
}

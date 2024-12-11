import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { RestoreDroppedEventDocument } from './mutations.generated';
import { EventAdminEventsQueryDocument } from './queries.generated';

export async function action({ params: { eventId } }) {
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
}

import { ActionFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { DeleteRunDocument } from './mutations.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { eventCategoryId, eventId, runId }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteRunDocument,
        variables: {
          input: {
            id: runId ?? '',
          },
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify({ __typename: 'Run', id: runId }),
            fields(fieldValue, details) {
              return details.DELETE;
            },
          });
          cache.modify({
            id: cache.identify({ __typename: 'Event', id: eventId }),
            fields(fieldValue, details) {
              return details.INVALIDATE;
            },
          });
        },
      });
      return redirect(`/admin_events/${eventCategoryId}`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

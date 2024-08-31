import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { DeleteRunDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { eventCategoryId, eventId, runId }, request }) => {
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

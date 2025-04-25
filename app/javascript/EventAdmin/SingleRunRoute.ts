import { redirect } from 'react-router';
import { DeleteRunDocument } from './mutations.generated';
import { Route } from './+types/SingleRunRoute';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { eventCategoryId, eventId, runId }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.get(apolloClientContext).mutate({
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
}

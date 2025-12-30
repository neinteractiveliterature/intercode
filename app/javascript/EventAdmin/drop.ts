import { ActionFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { DropEventDocument } from '../EventAdmin/mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, params: { eventId }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'PATCH') {
      await client.mutate({
        mutation: DropEventDocument,
        variables: {
          input: { id: eventId ?? '' },
        },
      });
    } else {
      return new Response(null, { status: 404 });
    }

    return redirect('../..');
  } catch (error) {
    return error;
  }
};

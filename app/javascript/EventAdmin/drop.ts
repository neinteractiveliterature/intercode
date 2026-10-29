import { redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { DropEventDocument } from '../EventAdmin/mutations.generated';
import type { Route } from './+types/drop';

export const clientAction = async ({ context, params: { eventId }, request }: Route.ClientActionArgs) => {
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

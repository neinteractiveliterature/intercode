import { redirect } from 'react-router';
import { Route } from './+types/drop';
import { apolloClientContext } from '../AppContexts';
import { DropEventDocument } from '../EventAdmin/mutations.generated';

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

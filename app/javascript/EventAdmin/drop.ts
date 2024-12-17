import { redirect } from 'react-router';
import { DropEventDocument } from '../EventAdmin/mutations.generated';
import { Route } from './+types/drop';

export async function action({ params: { eventId }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'PATCH') {
      await context.client.mutate({
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
}

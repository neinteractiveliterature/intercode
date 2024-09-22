import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { DropEventDocument } from '../EventAdmin/mutations.generated';

export const action: ActionFunction = async ({ params: { eventId }, request }) => {
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

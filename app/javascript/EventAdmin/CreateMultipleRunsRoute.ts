import { ActionFunction } from 'react-router';
import { RunInput } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';
import { CreateMultipleRunsDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request, params: { eventId } }) => {
  try {
    const formData = await request.formData();
    const timespanStarts = formData.getAll('starts_at').map((value) => value.toString());
    const roomIds = formData.getAll('room_id').map((value) => value.toString());

    const runs: RunInput[] = timespanStarts.map((start) => ({
      starts_at: start,
      roomIds: roomIds,
    }));

    await client.mutate({
      mutation: CreateMultipleRunsDocument,
      variables: {
        input: { eventId, runs },
      },
      update: (cache) => {
        cache.modify({
          id: cache.identify({ __typename: 'Event', id: eventId }),
          fields(value, { INVALIDATE }) {
            return INVALIDATE;
          },
        });
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    return error;
  }
};

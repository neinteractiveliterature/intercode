import { ActionFunction, json } from 'react-router';
import { RunInput } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';
import { CreateMultipleRunsDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request, params: { eventId } }) => {
  try {
    const requestJson = await request.json();
    const timespanStarts: string[] = requestJson.starts_at;
    const roomIds: string[] = requestJson.room_id;

    const runs: RunInput[] = timespanStarts.map((start) => ({
      starts_at: start,
      roomIds: roomIds,
    }));

    const { data } = await client.mutate({
      mutation: CreateMultipleRunsDocument,
      variables: {
        input: { eventId, runs },
      },
    });
    await client.resetStore();

    return json(data);
  } catch (error) {
    return error;
  }
};

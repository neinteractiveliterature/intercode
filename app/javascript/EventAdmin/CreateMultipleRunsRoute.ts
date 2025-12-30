import { ActionFunction, data, RouterContextProvider } from 'react-router';
import { RunInput } from '../graphqlTypes.generated';
import { apolloClientContext } from '../AppContexts';
import { CreateMultipleRunsDocument } from './mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ request, params: { eventId }, context }) => {
  const client = context.get(apolloClientContext);
  try {
    const requestJson = await request.json();
    const timespanStarts: string[] = requestJson.starts_at;
    const roomIds: string[] = requestJson.room_id;

    const runs: RunInput[] = timespanStarts.map((start) => ({
      starts_at: start,
      roomIds: roomIds,
    }));

    const result = await client.mutate({
      mutation: CreateMultipleRunsDocument,
      variables: {
        input: { eventId, runs },
      },
    });
    await client.resetStore();

    return data(result.data);
  } catch (error) {
    return error;
  }
};

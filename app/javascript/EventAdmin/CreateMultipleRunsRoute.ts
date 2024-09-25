import { data } from 'react-router';
import { RunInput } from '../graphqlTypes.generated';
import { CreateMultipleRunsDocument } from './mutations.generated';
import { Route } from './+types/CreateMultipleRunsRoute';

export async function action({ request, params: { eventId }, context }: Route.ActionArgs) {
  try {
    const requestJson = await request.json();
    const timespanStarts: string[] = requestJson.starts_at;
    const roomIds: string[] = requestJson.room_id;

    const runs: RunInput[] = timespanStarts.map((start) => ({
      starts_at: start,
      roomIds: roomIds,
    }));

    const result = await context.client.mutate({
      mutation: CreateMultipleRunsDocument,
      variables: {
        input: { eventId, runs },
      },
    });
    await context.client.resetStore();

    return data(result.data);
  } catch (error) {
    return error;
  }
}

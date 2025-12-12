import { Room } from '~/graphqlTypes.generated';
import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { DeleteRoomDocument, UpdateRoomDocument } from '~/RoomsAdmin/mutations.generated';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../AppContexts';

export const action: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
  const client = context.get(apolloClientContext);
  invariant(id != null);

  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
        mutation: DeleteRoomDocument,
        variables: { input: { id } },
        update: (cache) => {
          cache.modify<Room>({
            id: cache.identify({ __typename: 'Room', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return data(result.data);
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      const result = await client.mutate({
        mutation: UpdateRoomDocument,
        variables: { input: { id, room: { name: formData.get('name')?.toString() } } },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

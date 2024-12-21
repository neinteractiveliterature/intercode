import { Room } from 'graphqlTypes.generated';
import { data } from 'react-router';
import { DeleteRoomDocument, UpdateRoomDocument } from 'RoomsAdmin/mutations.generated';
import invariant from 'tiny-invariant';
import { Route } from './+types/route';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  invariant(id != null);

  try {
    if (request.method === 'DELETE') {
      const result = await context.client.mutate({
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
      const result = await context.client.mutate({
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
}

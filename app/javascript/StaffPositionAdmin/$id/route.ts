import { StaffPosition } from 'graphqlTypes.generated';
import { data } from 'react-router';
import { DeleteStaffPositionDocument } from 'StaffPositionAdmin/mutations.generated';
import { Route } from './+types/route';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      const result = await context.client.mutate({
        mutation: DeleteStaffPositionDocument,
        variables: { input: { id } },
        update: (cache) => {
          cache.modify<StaffPosition>({
            id: cache.identify({ __typename: 'StaffPosition', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return data(result.data);
    }
  } catch (error) {
    return error;
  }
}

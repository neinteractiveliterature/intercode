import { StaffPosition } from '~/graphqlTypes.generated';
import { data } from 'react-router';
import { DeleteStaffPositionDocument } from '~/StaffPositionAdmin/mutations.generated';
import { apolloClientContext } from '../../AppContexts';
import { Route } from './+types/route';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
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
};

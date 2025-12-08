import { StaffPosition } from 'graphqlTypes.generated';
import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { DeleteStaffPositionDocument } from 'StaffPositionAdmin/mutations.generated';
import { apolloClientContext } from '../../AppContexts';

export const action: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
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

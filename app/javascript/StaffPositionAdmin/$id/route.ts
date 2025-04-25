import { StaffPosition } from 'graphqlTypes.generated';
import { ActionFunction, data } from 'react-router';
import { DeleteStaffPositionDocument } from 'StaffPositionAdmin/mutations.generated';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ request, params: { id } }) => {
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

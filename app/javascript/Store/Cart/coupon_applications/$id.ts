import { ActionFunction, json } from 'react-router';
import { DeleteCouponApplicationDocument } from 'Store/mutations.generated';
import { client } from 'useIntercodeApolloClient';
import { CartQueryDocument } from '../queries.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    if (request.method === 'DELETE') {
      const { data } = await client.mutate({
        mutation: DeleteCouponApplicationDocument,
        variables: { id },
        refetchQueries: [{ query: CartQueryDocument }],
        awaitRefetchQueries: true,
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

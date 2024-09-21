import { ActionFunction, json } from 'react-router';
import { DeleteCouponApplicationDocument } from 'Store/mutations.generated';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    if (request.method === 'DELETE') {
      const { data } = await client.mutate({
        mutation: DeleteCouponApplicationDocument,
        variables: { id },
      });
      await client.resetStore();
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

import { data } from 'react-router';
import { DeleteCouponApplicationDocument } from 'Store/mutations.generated';
import { CartQueryDocument } from '../queries.generated';
import { Route } from './+types/$id';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      const result = await context.get(apolloClientContext).mutate({
        mutation: DeleteCouponApplicationDocument,
        variables: { id },
        refetchQueries: [{ query: CartQueryDocument }],
        awaitRefetchQueries: true,
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

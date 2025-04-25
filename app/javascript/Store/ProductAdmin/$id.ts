import { Product } from 'graphqlTypes.generated';
import { data } from 'react-router';
import { parseProductFormData } from 'Store/buildProductInput';
import invariant from 'tiny-invariant';
import { DeleteProductDocument, UpdateProductDocument } from './mutations.generated';
import { Route } from './+types/$id';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  invariant(id != null);
  try {
    if (request.method === 'DELETE') {
      const result = await context.get(apolloClientContext).mutate({
        mutation: DeleteProductDocument,
        variables: { id },
        update: (cache) => {
          cache.modify<Product>({
            id: cache.identify({ __typename: 'Product', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return data(result.data);
    } else if (request.method === 'PATCH') {
      const product = parseProductFormData(await request.formData());
      const result = await context.get(apolloClientContext).mutate({
        mutation: UpdateProductDocument,
        variables: { id, product },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

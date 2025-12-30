import { Product } from '~/graphqlTypes.generated';
import { ActionFunction, data, RouterContextProvider } from 'react-router';
import { parseProductFormData } from '~/Store/buildProductInput';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '~/AppContexts';
import { DeleteProductDocument, UpdateProductDocument } from './mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ params: { id }, request, context }) => {
  const client = context.get(apolloClientContext);
  invariant(id != null);
  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
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
      const result = await client.mutate({
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
};

import { Product } from 'graphqlTypes.generated';
import { ActionFunction, json } from 'react-router';
import { parseProductFormData } from 'Store/buildProductInput';
import { DeleteProductDocument, UpdateProductDocument } from 'Store/mutations.generated';
import invariant from 'tiny-invariant';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  invariant(id != null);
  try {
    if (request.method === 'DELETE') {
      const { data } = await client.mutate({
        mutation: DeleteProductDocument,
        variables: { id },
        update: (cache) => {
          cache.modify<Product>({
            id: cache.identify({ __typename: 'Product', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return json(data);
    } else if (request.method === 'PATCH') {
      const product = parseProductFormData(await request.formData());
      const { data } = await client.mutate({
        mutation: UpdateProductDocument,
        variables: { id, product },
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

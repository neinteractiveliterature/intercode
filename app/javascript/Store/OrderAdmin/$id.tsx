import { OrderInput } from '~/graphqlTypes.generated';
import { data, useLoaderData, useNavigate } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import EditOrderModal from './EditOrderModal';
import { AdminUpdateOrderDocument } from './mutations.generated';
import { AdminOrderQueryData, AdminOrderQueryDocument } from './queries.generated';
import { Route } from './+types/$id';

export const clientAction = async ({ params: { id }, request, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'PATCH') {
      const order = (await request.json()) as OrderInput;
      const result = await client.mutate({
        mutation: AdminUpdateOrderDocument,
        variables: { id: id ?? '', order },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

export const clientLoader = async ({ params: { id }, context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: AdminOrderQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

function EditOrderRoute() {
  const data = useLoaderData() as AdminOrderQueryData;
  const navigate = useNavigate();

  return <EditOrderModal order={data.convention.order} closeModal={() => navigate('..')} />;
}

export const Component = EditOrderRoute;

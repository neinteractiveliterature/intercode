import { OrderInput } from '~/graphqlTypes.generated';
import { ActionFunction, data, LoaderFunction, useLoaderData, useNavigate, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import EditOrderModal from './EditOrderModal';
import { AdminUpdateOrderDocument } from './mutations.generated';
import { AdminOrderQueryData, AdminOrderQueryDocument } from './queries.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ params: { id }, request, context }) => {
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

export const clientLoader: LoaderFunction<RouterContextProvider> = async ({ params: { id }, context }) => {
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

import { OrderInput } from 'graphqlTypes.generated';
import { ActionFunction, json, LoaderFunction, useLoaderData, useNavigate } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import EditOrderModal from './EditOrderModal';
import { AdminUpdateOrderDocument } from './mutations.generated';
import { AdminOrderQueryData, AdminOrderQueryDocument } from './queries.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    if (request.method === 'PATCH') {
      const order = (await request.json()) as OrderInput;
      const { data } = await client.mutate({
        mutation: AdminUpdateOrderDocument,
        variables: { id, order },
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query({
    query: AdminOrderQueryDocument,
    variables: { id },
  });
  return data;
};

function EditOrderRoute() {
  const data = useLoaderData() as AdminOrderQueryData;
  const navigate = useNavigate();

  return <EditOrderModal order={data.convention.order} closeModal={() => navigate('..')} />;
}

export default EditOrderRoute;

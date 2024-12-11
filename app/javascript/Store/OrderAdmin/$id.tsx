import { OrderInput } from 'graphqlTypes.generated';
import { data, useNavigate } from 'react-router';
import EditOrderModal from './EditOrderModal';
import { AdminUpdateOrderDocument } from './mutations.generated';
import { AdminOrderQueryDocument } from './queries.generated';
import { Route } from './+types/$id';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'PATCH') {
      const order = (await request.json()) as OrderInput;
      const result = await context.client.mutate({
        mutation: AdminUpdateOrderDocument,
        variables: { id, order },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query({
    query: AdminOrderQueryDocument,
    variables: { id },
  });
  return data;
}

function EditOrderRoute({ loaderData: data }: Route.ComponentProps) {
  const navigate = useNavigate();

  return <EditOrderModal order={data.convention.order} closeModal={() => navigate('..')} />;
}

export default EditOrderRoute;

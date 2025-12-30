import { redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { DeleteDepartmentDocument } from './mutations.generated';
import { DepartmentAdminQueryDocument } from './queries.generated';
import { Route } from './+types/SingleDepartmentRoute';

export const clientAction = async ({ request, params: { id }, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeleteDepartmentDocument,
      variables: { id: id ?? '' },
      refetchQueries: [{ query: DepartmentAdminQueryDocument }],
      awaitRefetchQueries: true,
    });
    return redirect('..');
  } else {
    return new Response(null, { status: 404 });
  }
};

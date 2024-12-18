import { redirect } from 'react-router';
import { DeleteDepartmentDocument } from './mutations.generated';
import { DepartmentAdminQueryDocument } from './queries.generated';
import { Route } from './+types/SingleDepartmentRoute';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.client.mutate({
      mutation: DeleteDepartmentDocument,
      variables: { id },
      refetchQueries: [{ query: DepartmentAdminQueryDocument }],
      awaitRefetchQueries: true,
    });
    return redirect('..');
  } else {
    return new Response(null, { status: 404 });
  }
}

import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { DeleteDepartmentDocument } from './mutations.generated';
import { DepartmentAdminQueryDocument } from './queries.generated';

export async function action({ request, params: { id } }) {
  if (request.method === 'DELETE') {
    await client.mutate({
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

import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { DeleteDepartmentDocument } from './mutations.generated';
import { DepartmentAdminQueryDocument } from './queries.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
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
};

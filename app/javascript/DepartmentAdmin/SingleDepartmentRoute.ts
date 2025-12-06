import { ActionFunction, redirect, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { DeleteDepartmentDocument } from './mutations.generated';
import { DepartmentAdminQueryDocument } from './queries.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ request, params: { id }, context }) => {
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

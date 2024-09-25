import { redirect } from 'react-router';
import { DeleteCmsGraphqlQueryDocument } from './mutations.generated';
import { Route } from './+types/SingleGraphqlQueryRoute';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.client.mutate({
      mutation: DeleteCmsGraphqlQueryDocument,
      variables: { id },
    });
    await context.client.resetStore();

    return redirect('/cms_graphql_queries');
  }

  return new Response(null, { status: 404 });
}

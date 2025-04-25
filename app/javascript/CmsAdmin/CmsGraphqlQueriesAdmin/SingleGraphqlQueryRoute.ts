import { redirect } from 'react-router';
import { DeleteCmsGraphqlQueryDocument } from './mutations.generated';
import { Route } from './+types/SingleGraphqlQueryRoute';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.get(apolloClientContext).mutate({
      mutation: DeleteCmsGraphqlQueryDocument,
      variables: { id },
    });
    await context.get(apolloClientContext).resetStore();

    return redirect('/cms_graphql_queries');
  }

  return new Response(null, { status: 404 });
}

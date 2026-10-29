import { apolloClientContext } from 'AppContexts';
import { UserConProfileAdminQueryDocument } from './queries.generated';
import type { Route } from './+types/userConProfileLoader';

export const clientLoader = async ({ context, params: { id } }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: UserConProfileAdminQueryDocument,
    variables: { id },
    errorPolicy: 'none',
  });
  return data;
};

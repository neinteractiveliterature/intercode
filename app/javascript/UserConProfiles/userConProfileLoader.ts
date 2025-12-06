import { LoaderFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { UserConProfileAdminQueryData, UserConProfileAdminQueryDocument } from './queries.generated';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context, params: { id } }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<UserConProfileAdminQueryData>({
    query: UserConProfileAdminQueryDocument,
    variables: { id },
  });
  return data;
};

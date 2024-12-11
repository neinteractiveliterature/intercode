import { LoaderFunction } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { UserConProfileAdminQueryData, UserConProfileAdminQueryDocument } from './queries.generated';

export async function loader({ params: { id } }) {
  const { data } = await client.query<UserConProfileAdminQueryData>({
    query: UserConProfileAdminQueryDocument,
    variables: { id },
  });
  return data;
}

import { LoaderFunction } from 'react-router-dom';
import {
  SignupAdminEventQueryData,
  SignupAdminEventQueryDocument,
  SignupAdminEventQueryVariables,
} from './queries.generated';
import { client } from '../../useIntercodeApolloClient';

export const signupAdminEventLoader: LoaderFunction = async ({ params: { eventId } }) => {
  const { data } = await client.query<SignupAdminEventQueryData, SignupAdminEventQueryVariables>({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

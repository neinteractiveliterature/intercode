import { LoaderFunction, useRouteLoaderData } from 'react-router-dom';
import {
  AdminSignupQueryData,
  AdminSignupQueryDocument,
  AdminSignupQueryVariables,
  SignupAdminEventQueryData,
  SignupAdminEventQueryDocument,
  SignupAdminEventQueryVariables,
} from './queries.generated';
import { client } from '../../useIntercodeApolloClient';
import { NamedRoute } from '../../AppRouter';

export const signupAdminEventLoader: LoaderFunction = async ({ params: { eventId } }) => {
  const { data } = await client.query<SignupAdminEventQueryData, SignupAdminEventQueryVariables>({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

export const singleSignupLoader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<AdminSignupQueryData, AdminSignupQueryVariables>({
    query: AdminSignupQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

export function useSingleSignupLoader() {
  return useRouteLoaderData(NamedRoute.EditSignup) as AdminSignupQueryData;
}

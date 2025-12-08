import { LoaderFunction, RouterContextProvider, useRouteLoaderData } from 'react-router';
import {
  AdminSignupQueryData,
  AdminSignupQueryDocument,
  AdminSignupQueryVariables,
  SignupAdminEventQueryData,
  SignupAdminEventQueryDocument,
  SignupAdminEventQueryVariables,
} from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import { NamedRoute } from '../../AppRouter';

export const signupAdminEventLoader: LoaderFunction<RouterContextProvider> = async ({
  context,
  params: { eventId },
}) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<SignupAdminEventQueryData, SignupAdminEventQueryVariables>({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

export const singleSignupLoader: LoaderFunction<RouterContextProvider> = async ({ context, params: { id } }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<AdminSignupQueryData, AdminSignupQueryVariables>({
    query: AdminSignupQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

export function useSingleSignupLoader() {
  return useRouteLoaderData(NamedRoute.EditSignup) as AdminSignupQueryData;
}

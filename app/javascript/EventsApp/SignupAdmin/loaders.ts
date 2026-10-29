import { LoaderFunctionArgs } from 'react-router';
import { AdminSignupQueryDocument, SignupAdminEventQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import { NamedRoute } from '../../NamedRoute';
import useRequiredRouteLoaderData from '../../useRequiredRouteLoaderData';

export const signupAdminEventLoader = async ({ context, params: { eventId } }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
    errorPolicy: 'none',
  });
  return data;
};

export const singleSignupLoader = async ({ context, params: { id } }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: AdminSignupQueryDocument,
    variables: { id: id ?? '' },
    errorPolicy: 'none',
  });
  return data;
};

export function useSingleSignupLoader() {
  return useRequiredRouteLoaderData<typeof singleSignupLoader>(NamedRoute.EditSignup);
}

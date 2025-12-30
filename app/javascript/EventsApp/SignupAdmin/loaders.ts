import { useRouteLoaderData } from 'react-router';
import {
  AdminSignupQueryData,
  AdminSignupQueryDocument,
  SignupAdminEventQueryDocument,
} from './queries.generated';
import { apolloClientContext } from '~/AppContexts';
import { NamedRoute } from '../../AppRouter';
import { Route as SignupAdminRoute } from './+types/route';
import { Route as SingleSignupRoute } from './+types/singleSignupRoute';

export const signupAdminEventLoader = async ({
  context,
  params: { eventId },
}: SignupAdminRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: SignupAdminEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

export const singleSignupLoader = async ({ context, params: { id } }: SingleSignupRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: AdminSignupQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

export function useSingleSignupLoader() {
  return useRouteLoaderData(NamedRoute.EditSignup) as AdminSignupQueryData;
}

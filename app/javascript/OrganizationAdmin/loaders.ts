import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { OrganizationAdminOrganizationsQueryDocument } from './queries.generated';

export const organizationsLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: OrganizationAdminOrganizationsQueryDocument, errorPolicy: 'none' });
  return data;
};

export const singleOrganizationLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await organizationsLoader({ params: {}, ...args });
  const organization = data.organizations.find((org) => org.id === id);

  if (!organization) {
    throw new Response(null, { status: 404 });
  }

  return organization;
};

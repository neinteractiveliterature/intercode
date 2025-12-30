import { LoaderFunction } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import {
  OrganizationAdminOrganizationsQueryData,
  OrganizationAdminOrganizationsQueryDocument,
} from './queries.generated';

export const organizationsLoader: LoaderFunction = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: OrganizationAdminOrganizationsQueryDocument });
  return data;
};

export type SingleOrganizationLoaderResult = OrganizationAdminOrganizationsQueryData['organizations'][number];

export const singleOrganizationLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await organizationsLoader({ params: {}, ...args })) as OrganizationAdminOrganizationsQueryData;
  const organization = data.organizations.find((org) => org.id === id);

  if (!organization) {
    return new Response(null, { status: 404 });
  }

  return organization;
};

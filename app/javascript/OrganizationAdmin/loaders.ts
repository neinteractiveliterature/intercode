import { LoaderFunction } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import {
  OrganizationAdminOrganizationsQueryData,
  OrganizationAdminOrganizationsQueryDocument,
} from './queries.generated';

export const organizationsLoader: LoaderFunction = async () => {
  const { data } = await client.query<OrganizationAdminOrganizationsQueryData>({
    query: OrganizationAdminOrganizationsQueryDocument,
  });
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

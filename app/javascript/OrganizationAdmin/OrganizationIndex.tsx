import sortBy from 'lodash/sortBy';
import { Link, LoaderFunction, useLoaderData } from 'react-router-dom';
import { sortByLocaleString } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import {
  OrganizationAdminOrganizationsQueryData,
  OrganizationAdminOrganizationsQueryDocument,
} from './queries.generated';
import { client } from '../useIntercodeApolloClient';

function renderOrganizationConventions(organization: OrganizationAdminOrganizationsQueryData['organizations'][0]) {
  const sortedConventions = sortBy(organization.conventions, [(convention) => convention.starts_at]);
  sortedConventions.reverse();

  const conventionNames = sortedConventions.slice(0, 3).map((convention) => convention.name);
  if (sortedConventions.length > 3) {
    return `${conventionNames.join(', ')}, and ${sortedConventions.length - 3} more`;
  }

  return conventionNames.join(', ');
}

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<OrganizationAdminOrganizationsQueryData>({
    query: OrganizationAdminOrganizationsQueryDocument,
  });
  return data;
};

function OrganizationIndex() {
  const data = useLoaderData() as OrganizationAdminOrganizationsQueryData;
  usePageTitle('Organizations');

  const sortedOrganizations = sortByLocaleString(data.organizations, (organization) => organization.name);

  return (
    <>
      <h1 className="mb-4">Organizations</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Conventions</th>
          </tr>
        </thead>

        <tbody>
          {sortedOrganizations.map((organization) => (
            <tr key={organization.id}>
              <td>
                {organization.current_ability_can_manage_access ? (
                  <Link to={`/organizations/${organization.id}`}>{organization.name}</Link>
                ) : (
                  organization.name
                )}
              </td>
              <td>{renderOrganizationConventions(organization)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export const Component = OrganizationIndex;

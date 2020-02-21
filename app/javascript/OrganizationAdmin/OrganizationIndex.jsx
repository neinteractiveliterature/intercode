import React from 'react';
import sortBy from 'lodash/sortBy';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import { sortByLocaleString } from '../ValueUtils';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function renderOrganizationConventions(organization) {
  const sortedConventions = sortBy(
    organization.conventions,
    [(convention) => convention.starts_at],
  );
  sortedConventions.reverse();

  const conventionNames = sortedConventions.slice(0, 3).map((convention) => convention.name);
  if (sortedConventions.length > 3) {
    return `${conventionNames.join(', ')}, and ${sortedConventions.length - 3} more`;
  }

  return conventionNames.join(', ');
}

function OrganizationIndex() {
  const { data, loading, error } = useQuery(OrganizationAdminOrganizationsQuery);

  usePageTitle('Organizations');

  if (loading) return <PageLoadingIndicator visible />;
  if (error) return <ErrorDisplay graphQLError={error} />;

  const sortedOrganizations = sortByLocaleString(
    data.organizations,
    (organization) => organization.name,
  );

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
          {
            sortedOrganizations.map((organization) => (
              <tr key={organization.id}>
                <td>
                  {
                    organization.current_ability_can_manage_access
                      ? <Link to={`/organizations/${organization.id}`}>{organization.name}</Link>
                      : organization.name
                  }
                </td>
                <td>{renderOrganizationConventions(organization)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}

export default OrganizationIndex;

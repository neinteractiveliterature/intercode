import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';

function OrganizationDisplay({ organizationId }) {
  const { data, error } = useQuery(OrganizationAdminOrganizationsQuery);

  if (error) return <ErrorDisplay graphQLError={error} />;

  const organization = data.organizations.find(org => org.id === organizationId);

  return (
    <>
      <h1 className="mb-4">{organization.name}</h1>

      <h2>Roles</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {organization.organization_roles.map(organizationRole => (
            <tr>
              <td>{organizationRole.name}</td>
              <td>{organizationRole.users.map(user => user.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

OrganizationDisplay.propTypes = {
  organizationId: PropTypes.number.isRequired,
};

export default OrganizationDisplay;

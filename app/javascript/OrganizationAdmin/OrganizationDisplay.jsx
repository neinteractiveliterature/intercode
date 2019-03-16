import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import { titleize } from 'inflected';

import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import PermissionNames from '../../../config/permission_names.json';

const OrganizationRolePermissions = PermissionNames.find(group => group.role_type === 'OrganizationRole').permissions;
function getOrganizationRolePermissionName(permissionName) {
  const permission = OrganizationRolePermissions.find(p => p.permission === permissionName);
  return (permission || {}).name;
}

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
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {organization.organization_roles.map(organizationRole => (
            <tr>
              <td>{organizationRole.name}</td>
              <td>{organizationRole.users.map(user => user.name).join(', ')}</td>
              <td>
                {organizationRole.permissions
                  .map(permission => titleize(getOrganizationRolePermissionName(permission.permission)))
                  .join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to={`/${organizationId}/roles/new`} className="btn btn-primary">
        Add role
      </Link>
    </>
  );
}

OrganizationDisplay.propTypes = {
  organizationId: PropTypes.number.isRequired,
};

export default OrganizationDisplay;

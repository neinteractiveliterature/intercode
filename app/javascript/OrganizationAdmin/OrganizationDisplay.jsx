import React, { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Link, Redirect, useParams } from 'react-router-dom';
import { titleize } from 'inflected';

import { DeleteOrganizationRole } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import PermissionNames from '../../../config/permission_names.json';
import PopperDropdown from '../UIComponents/PopperDropdown';
import { useConfirm } from '../ModalDialogs/Confirm';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

const OrganizationRolePermissions = PermissionNames.find((group) => group.role_type === 'OrganizationRole').permissions;
function getOrganizationRolePermissionName(permissionName) {
  const permission = OrganizationRolePermissions.find((p) => p.permission === permissionName);
  return (permission || {}).name;
}

function OrganizationDisplay() {
  const organizationId = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(OrganizationAdminOrganizationsQuery);
  const confirm = useConfirm();
  const [mutate] = useMutation(DeleteOrganizationRole);
  const organization = useMemo(
    () => (error || loading ? null : data.organizations.find((org) => org.id === organizationId)),
    [data, error, loading, organizationId],
  );

  usePageTitle(useValueUnless(() => organization.name, error || loading));

  if (loading) return <PageLoadingIndicator visible />;
  if (error) return <ErrorDisplay graphQLError={error} />;

  if (!organization.current_ability_can_manage_access) {
    return <Redirect to="/organizations" />;
  }

  const deleteOrganizationRole = (id) => mutate({
    variables: { id },
    update: (proxy) => {
      const storeData = proxy.readQuery({ query: OrganizationAdminOrganizationsQuery });
      proxy.writeQuery({
        query: OrganizationAdminOrganizationsQuery,
        data: {
          ...storeData,
          organizations: storeData.organizations.map((org) => {
            if (org.id === organizationId) {
              return {
                ...org,
                organization_roles: org.organization_roles
                  .filter((role) => role.id !== id),
              };
            }

            return org;
          }),
        },
      });
    },
  });

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
            <th />
          </tr>
        </thead>
        <tbody>
          {organization.organization_roles.map((organizationRole) => (
            <tr>
              <td>{organizationRole.name}</td>
              <td>{organizationRole.users.map((user) => user.name).join(', ')}</td>
              <td>
                {organizationRole.permissions
                  .map((permission) => titleize(
                    getOrganizationRolePermissionName(permission.permission),
                  ))
                  .join(', ')}
              </td>
              <td>
                <PopperDropdown
                  renderReference={({ ref, toggle }) => (
                    <button type="button" className="btn btn-sm btn-primary" ref={ref} onClick={toggle}>
                      <i className="fa fa-ellipsis-h" />
                      <span className="sr-only">Options</span>
                    </button>
                  )}
                >
                  <Link to={`/organizations/${organization.id}/roles/${organizationRole.id}/edit`} className="dropdown-item">
                    Edit settings
                  </Link>
                  <button
                    className="dropdown-item cursor-pointer text-danger"
                    type="button"
                    onClick={() => confirm({
                      prompt: `Are you sure you want to delete the role ${organizationRole.name}?`,
                      action: () => deleteOrganizationRole(organizationRole.id),
                      renderError: (e) => <ErrorDisplay graphQLError={e} />,
                    })}
                  >
                    Delete
                  </button>
                </PopperDropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to={`/organizations/${organizationId}/roles/new`} className="btn btn-primary">
        Add role
      </Link>
    </>
  );
}

export default OrganizationDisplay;

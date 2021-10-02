import { Link, Redirect } from 'react-router-dom';
import { titleize } from 'inflected';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import { OrganizationAdminOrganizationsQuery } from './queries';
import PermissionNames from '../../../config/permission_names.json';
import usePageTitle from '../usePageTitle';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import {
  OrganizationAdminOrganizationsQueryData,
  useOrganizationAdminOrganizationsQuery,
} from './queries.generated';
import { useDeleteOrganizationRoleMutation } from './mutations.generated';

const OrganizationRolePermissions =
  PermissionNames.find((group) => group.role_type === 'OrganizationRole')?.permissions ?? [];

function getOrganizationRolePermissionName(permissionName: string) {
  const permission = OrganizationRolePermissions.find((p) => p.permission === permissionName);
  return permission?.name;
}

export default LoadSingleValueFromCollectionWrapper(
  useOrganizationAdminOrganizationsQuery,
  (data, id) => data.organizations.find((org) => org.id.toString() === id),
  function OrganizationDisplay({ value: organization }) {
    const confirm = useConfirm();
    const [mutate] = useDeleteOrganizationRoleMutation();

    usePageTitle(organization.name);

    if (!organization.current_ability_can_manage_access) {
      return <Redirect to="/organizations" />;
    }

    const deleteOrganizationRole = (id: number) =>
      mutate({
        variables: { id },
        update: (proxy) => {
          const storeData = proxy.readQuery<OrganizationAdminOrganizationsQueryData>({
            query: OrganizationAdminOrganizationsQuery,
          });
          if (!storeData) {
            return;
          }

          proxy.writeQuery<OrganizationAdminOrganizationsQueryData>({
            query: OrganizationAdminOrganizationsQuery,
            data: {
              ...storeData,
              organizations: storeData.organizations.map((org) => {
                if (org.id === organization.id) {
                  return {
                    ...org,
                    organization_roles: org.organization_roles.filter((role) => role.id !== id),
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
              <tr key={organizationRole.id}>
                <td>{organizationRole.name}</td>
                <td>{organizationRole.users.map((user) => user.name).join(', ')}</td>
                <td>
                  {organizationRole.permissions
                    .map((permission) =>
                      titleize(getOrganizationRolePermissionName(permission.permission) ?? ''),
                    )
                    .join(', ')}
                </td>
                <td>
                  <DropdownMenu
                    buttonClassName="btn btn-sm btn-primary"
                    buttonContent={
                      <>
                        <i className="bi-three-dots" />
                        <span className="visually-hidden">Options</span>
                      </>
                    }
                    popperOptions={{ placement: 'bottom-end' }}
                  >
                    <Link
                      to={`/organizations/${organization.id}/roles/${organizationRole.id}/edit`}
                      className="dropdown-item"
                    >
                      Edit settings
                    </Link>
                    <button
                      className="dropdown-item cursor-pointer text-danger"
                      type="button"
                      onClick={() =>
                        confirm({
                          prompt: `Are you sure you want to delete the role ${organizationRole.name}?`,
                          action: () => deleteOrganizationRole(organizationRole.id),
                          renderError: (e) => <ErrorDisplay graphQLError={e} />,
                        })
                      }
                    >
                      Delete
                    </button>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link to={`/organizations/${organization.id}/roles/new`} className="btn btn-primary">
          Add role
        </Link>
      </>
    );
  },
);

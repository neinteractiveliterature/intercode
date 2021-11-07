import { Link, Redirect } from 'react-router-dom';
import { ErrorDisplay, useConfirm, useDeleteMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import PermissionNames from '../../../config/permission_names.json';
import usePageTitle from '../usePageTitle';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { useOrganizationAdminOrganizationsQuery } from './queries.generated';
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
    const [deleteOrganizationRole] = useDeleteMutationWithReferenceArrayUpdater(
      useDeleteOrganizationRoleMutation,
      organization,
      'organization_roles',
      (organizationRole) => ({ id: organizationRole.id }),
    );

    usePageTitle(organization.name);

    if (!organization.current_ability_can_manage_access) {
      return <Redirect to="/organizations" />;
    }

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
                    .map((permission) => capitalize(getOrganizationRolePermissionName(permission.permission) ?? ''))
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
                          action: () => deleteOrganizationRole(organizationRole),
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

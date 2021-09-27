import { useMemo } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { LoadQueryWrapper, ErrorDisplay } from '@neinteractiveliterature/litform';

import useOrganizationRoleForm, { OrganizationRoleFormState } from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import {
  OrganizationAdminOrganizationsQueryData,
  useOrganizationAdminOrganizationsQuery,
} from './queries.generated';
import { useUpdateOrganizationRoleMutation } from './mutations.generated';
import FourOhFourPage from '../FourOhFourPage';

type EditOrganizationRoleFormProps = {
  organization: OrganizationAdminOrganizationsQueryData['organizations'][number];
  initialOrganizationRole: OrganizationAdminOrganizationsQueryData['organizations'][number]['organization_roles'][number];
};

function EditOrganizationRoleForm({
  organization,
  initialOrganizationRole,
}: EditOrganizationRoleFormProps) {
  const history = useHistory();

  const { renderForm, formState } = useOrganizationRoleForm(initialOrganizationRole);
  const [mutate, { error: mutationError, loading: mutationInProgress }] =
    useUpdateOrganizationRoleMutation();

  usePageTitle(`Editing “${initialOrganizationRole.name}”`);
  const updateOrganizationRole = async ({
    name,
    usersChangeSet,
    permissionsChangeSet,
  }: OrganizationRoleFormState) => {
    await mutate({
      variables: {
        id: initialOrganizationRole.id,
        name,
        addUserIds: usersChangeSet.getAddValues().map((user) => user.id),
        removeUserIds: usersChangeSet.getRemoveIds(),
        addPermissions: permissionsChangeSet.getAddValues().map((permission) => ({
          permission: permission.permission,
        })),
        removePermissionIds: permissionsChangeSet.getRemoveIds(),
      },
    });

    history.push(`/organizations/${organization.id}`);
  };

  if (!organization.current_ability_can_manage_access) {
    return <Redirect to="/organizations" />;
  }

  return (
    <>
      <h1 className="mb-4">
        {'Edit role '}
        {formState.name}
      </h1>

      {renderForm()}

      <ErrorDisplay graphQLError={mutationError} />

      <button
        className="btn btn-primary"
        type="button"
        onClick={() => updateOrganizationRole(formState)}
        disabled={mutationInProgress}
      >
        Save changes
      </button>
    </>
  );
}

export default LoadQueryWrapper(
  useOrganizationAdminOrganizationsQuery,
  function EditOrganizationRole({ data }) {
    const params = useParams<{ organizationId: string; organizationRoleId: string }>();
    const organizationId = Number.parseInt(params.organizationId, 10);
    const organizationRoleId = Number.parseInt(params.organizationRoleId, 10);
    const organization = useMemo(
      () => data.organizations.find((org) => org.id === organizationId),
      [data, organizationId],
    );
    const initialOrganizationRole = useMemo(
      () => organization?.organization_roles.find((role) => role.id === organizationRoleId),
      [organization, organizationRoleId],
    );

    if (!organization || !initialOrganizationRole) {
      return <FourOhFourPage />;
    }

    return (
      <EditOrganizationRoleForm
        organization={organization}
        initialOrganizationRole={initialOrganizationRole}
      />
    );
  },
);

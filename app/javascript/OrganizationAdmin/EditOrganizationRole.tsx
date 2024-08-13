import { LoaderFunction, Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import useOrganizationRoleForm, { OrganizationRoleFormState } from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import { OrganizationAdminOrganizationsQueryData } from './queries.generated';
import { useUpdateOrganizationRoleMutation } from './mutations.generated';
import { organizationsLoader } from './loaders';

type LoaderResult = {
  organization: OrganizationAdminOrganizationsQueryData['organizations'][number];
  initialOrganizationRole: OrganizationAdminOrganizationsQueryData['organizations'][number]['organization_roles'][number];
};

export const loader: LoaderFunction = async ({ params: { id, organizationRoleId }, ...args }) => {
  const data = (await organizationsLoader({ params: {}, ...args })) as OrganizationAdminOrganizationsQueryData;
  const organization = data.organizations.find((org) => org.id === id);
  const initialOrganizationRole = organization?.organization_roles.find((role) => role.id === organizationRoleId);

  if (!organization || !initialOrganizationRole) {
    return new Response(null, { status: 404 });
  }

  return { initialOrganizationRole, organization } satisfies LoaderResult;
};

function EditOrganizationRoleForm() {
  const { organization, initialOrganizationRole } = useLoaderData() as LoaderResult;
  const navigate = useNavigate();

  const { renderForm, formState } = useOrganizationRoleForm(initialOrganizationRole);
  const [mutate, { error: mutationError, loading: mutationInProgress }] = useUpdateOrganizationRoleMutation();

  usePageTitle(`Editing “${initialOrganizationRole.name}”`);
  const updateOrganizationRole = async ({ name, usersChangeSet, permissionsChangeSet }: OrganizationRoleFormState) => {
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

    navigate(`/organizations/${organization.id}`);
  };

  if (!organization.current_ability_can_manage_access) {
    return <Navigate to="/organizations" />;
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

export const Component = EditOrganizationRoleForm;

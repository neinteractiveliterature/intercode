import { LoaderFunction, Navigate, useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import useOrganizationRoleForm from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import { OrganizationAdminOrganizationsQueryData } from './queries.generated';
import { organizationsLoader } from './loaders';
import { ApolloError } from '@apollo/client';

type LoaderResult = {
  organization: OrganizationAdminOrganizationsQueryData['organizations'][number];
  initialOrganizationRole: OrganizationAdminOrganizationsQueryData['organizations'][number]['organization_roles'][number];
};

export async function loader({ params: { id, organizationRoleId }, ...args }) {
  const data = (await organizationsLoader({ params: {}, ...args })) as OrganizationAdminOrganizationsQueryData;
  const organization = data.organizations.find((org) => org.id === id);
  const initialOrganizationRole = organization?.organization_roles.find((role) => role.id === organizationRoleId);

  if (!organization || !initialOrganizationRole) {
    return new Response(null, { status: 404 });
  }

  return { initialOrganizationRole, organization } satisfies LoaderResult;
}

function EditOrganizationRoleForm() {
  const { organization, initialOrganizationRole } = useLoaderData() as LoaderResult;
  const { renderForm, formState } = useOrganizationRoleForm(initialOrganizationRole);
  const submit = useSubmit();
  const actionData = useActionData();
  const mutationError = actionData instanceof Error ? actionData : undefined;
  const mutationInProgress = useNavigation().state !== 'idle';

  usePageTitle(`Editing “${initialOrganizationRole.name}”`);
  const updateOrganizationRole = () => {
    submit(
      {
        name: formState.name,
        addUserIds: formState.usersChangeSet.getAddValues().map((user) => user.id),
        removeUserIds: formState.usersChangeSet.getRemoveIds(),
        addPermissions: formState.permissionsChangeSet.getAddValues().map((permission) => ({
          permission: permission.permission,
        })),
        removePermissionIds: formState.permissionsChangeSet.getRemoveIds(),
      },
      {
        action: `/organizations/${organization.id}/roles/${initialOrganizationRole.id}`,
        method: 'PATCH',
        encType: 'application/json',
      },
    );
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

      <ErrorDisplay graphQLError={mutationError as ApolloError} />

      <button
        className="btn btn-primary"
        type="button"
        onClick={() => updateOrganizationRole()}
        disabled={mutationInProgress}
      >
        Save changes
      </button>
    </>
  );
}

export default EditOrganizationRoleForm;

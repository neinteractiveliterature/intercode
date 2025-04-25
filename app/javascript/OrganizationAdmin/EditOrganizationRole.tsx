import { Navigate, useActionData, useNavigation, useSubmit } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import useOrganizationRoleForm from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import { OrganizationAdminOrganizationQueryDocument } from './queries.generated';
import { ApolloError } from '@apollo/client';
import { Route } from './+types/EditOrganizationRole';
import { apolloClientContext } from 'AppContexts';

export async function loader({ params: { id, organizationRoleId }, context }: Route.LoaderArgs) {
  const { data } = await context
    .get(apolloClientContext)
    .query({ query: OrganizationAdminOrganizationQueryDocument, variables: { id } });
  const organization = data.organization;
  const initialOrganizationRole = organization?.organization_roles.find((role) => role.id === organizationRoleId);

  if (!initialOrganizationRole) {
    throw new Response(null, { status: 404 });
  }

  return { initialOrganizationRole, organization };
}

function EditOrganizationRoleForm({ loaderData: { organization, initialOrganizationRole } }: Route.ComponentProps) {
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

import { Navigate, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import useOrganizationRoleForm, { OrganizationRoleFormState } from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import { OrganizationRoleFieldsFragmentDoc } from './queries.generated';
import { useCreateOrganizationRoleMutation } from './mutations.generated';
import { NamedRoute } from '../AppRouter';
import { SingleOrganizationLoaderResult } from './loaders';

function NewOrganizationRole() {
  const organization = useRouteLoaderData(NamedRoute.Organization) as SingleOrganizationLoaderResult;
  const navigate = useNavigate();
  const { renderForm, formState } = useOrganizationRoleForm({
    __typename: 'OrganizationRole',
    id: '',
    name: '',
    users: [],
    permissions: [],
  });
  const [mutate, { error: mutationError, loading: mutationInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateOrganizationRoleMutation,
    organization,
    'organization_roles',
    (data) => data.createOrganizationRole.organization_role,
    OrganizationRoleFieldsFragmentDoc,
  );

  usePageTitle('New organization role');

  if (!organization.current_ability_can_manage_access) {
    return <Navigate to="/organizations" />;
  }

  const createOrganizationRole = async ({ name, usersChangeSet, permissionsChangeSet }: OrganizationRoleFormState) => {
    await mutate({
      variables: {
        organizationId: organization.id,
        name,
        userIds: usersChangeSet.getAddValues().map((user) => user.id),
        permissions: permissionsChangeSet.getAddValues().map((permission) => ({
          permission: permission.permission,
        })),
      },
    });
    navigate(`/organizations/${organization.id}`);
  };

  return (
    <>
      <h1 className="mb-4">New role in {organization.name}</h1>

      {renderForm()}

      <ErrorDisplay graphQLError={mutationError} />

      <button
        className="btn btn-primary"
        type="button"
        onClick={() => createOrganizationRole(formState)}
        disabled={mutationInProgress}
      >
        Create role
      </button>
    </>
  );
}

export const Component = NewOrganizationRole;

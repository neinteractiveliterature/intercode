import { Navigate, useNavigate } from 'react-router-dom';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import useOrganizationRoleForm, { OrganizationRoleFormState } from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { OrganizationRoleFieldsFragmentDoc, useOrganizationAdminOrganizationsQuery } from './queries.generated';
import { useCreateOrganizationRoleMutation } from './mutations.generated';

export default LoadSingleValueFromCollectionWrapper(
  useOrganizationAdminOrganizationsQuery,
  (data, id) => data.organizations.find((org) => org.id.toString() === id),
  function NewOrganizationRole({ value: organization }) {
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

    const createOrganizationRole = async ({
      name,
      usersChangeSet,
      permissionsChangeSet,
    }: OrganizationRoleFormState) => {
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
  },
);

import { Redirect, useHistory } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { OrganizationAdminOrganizationsQuery } from './queries';
import useOrganizationRoleForm, { OrganizationRoleFormState } from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { OrganizationAdminOrganizationsQueryData, useOrganizationAdminOrganizationsQuery } from './queries.generated';
import { useCreateOrganizationRoleMutation } from './mutations.generated';

export default LoadSingleValueFromCollectionWrapper(
  useOrganizationAdminOrganizationsQuery,
  (data, id) => data.organizations.find((org) => org.id.toString() === id),
  function NewOrganizationRole({ value: organization }) {
    const history = useHistory();
    const { renderForm, formState } = useOrganizationRoleForm({
      __typename: 'OrganizationRole',
      id: '',
      name: '',
      users: [],
      permissions: [],
    });
    const [mutate, { error: mutationError, loading: mutationInProgress }] = useCreateOrganizationRoleMutation();

    usePageTitle('New organization role');

    if (!organization.current_ability_can_manage_access) {
      return <Redirect to="/organizations" />;
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
        update: (proxy, result) => {
          const storeData = proxy.readQuery<OrganizationAdminOrganizationsQueryData>({
            query: OrganizationAdminOrganizationsQuery,
          });
          const newRole = result.data?.createOrganizationRole?.organization_role;
          if (!storeData || !newRole) {
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
                    organization_roles: [...org.organization_roles, newRole],
                  };
                }

                return org;
              }),
            },
          });
        },
      });
      history.push(`/organizations/${organization.id}`);
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

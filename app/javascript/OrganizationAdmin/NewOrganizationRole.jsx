import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { CreateOrganizationRole } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import useOrganizationRoleForm from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function NewOrganizationRole() {
  const organizationId = Number.parseInt(useParams().organizationId, 10);
  const history = useHistory();
  const { data, loading, error } = useQuery(OrganizationAdminOrganizationsQuery);
  const { renderForm, formState } = useOrganizationRoleForm({ name: '', users: [], permissions: [] });
  const [
    mutate, { error: mutationError, loading: mutationInProgress },
  ] = useMutation(CreateOrganizationRole);

  usePageTitle('New organization role');

  if (loading) return <PageLoadingIndicator visible />;
  if (error) return <ErrorDisplay graphQLError={error} />;

  const organization = data.organizations.find((org) => org.id === organizationId);
  if (!organization.current_ability_can_manage_access) {
    return <Redirect to="/organizations" />;
  }

  const createOrganizationRole = async ({
    name, usersChangeSet, permissionsChangeSet,
  }) => {
    await mutate({
      variables: {
        organizationId,
        name,
        userIds: usersChangeSet.getAddValues().map((user) => user.id),
        permissions: permissionsChangeSet.getAddValues().map((permission) => ({
          permission: permission.permission,
        })),
      },
      update: (proxy, { data: { createOrganizationRole: { organization_role: newRole } } }) => {
        const storeData = proxy.readQuery({ query: OrganizationAdminOrganizationsQuery });
        proxy.writeQuery({
          query: OrganizationAdminOrganizationsQuery,
          data: {
            ...storeData,
            organizations: storeData.organizations.map((org) => {
              if (org.id === organizationId) {
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
    history.push(`/organizations/${organizationId}`);
  };

  return (
    <>
      <h1 className="mb-4">
        New role in
        {' '}
        {organization.name}
      </h1>

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

export default NewOrganizationRole;

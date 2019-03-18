import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { Redirect, withRouter } from 'react-router-dom';

import { CreateOrganizationRole } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import useAsyncFunction from '../useAsyncFunction';
import useOrganizationRoleForm from './useOrganizationRoleForm';

function NewOrganizationRole({ organizationId, history }) {
  const { data, error } = useQuery(OrganizationAdminOrganizationsQuery);
  const { renderForm, formState } = useOrganizationRoleForm({ name: '', users: [], permissions: [] });
  const [mutate, mutationError, mutationInProgress] = useAsyncFunction(
    useMutation(CreateOrganizationRole),
  );

  if (error) return <ErrorDisplay graphQLError={error} />;

  const organization = data.organizations.find(org => org.id === organizationId);
  if (!organization.current_ability_can_manage_access) {
    return <Redirect to="/" />;
  }

  const createOrganizationRole = async ({
    organizationRole, usersChangeSet, permissionsChangeSet,
  }) => {
    await mutate({
      variables: {
        organizationId,
        name: organizationRole.name,
        userIds: usersChangeSet.getAddValues().map(user => user.id),
        permissions: permissionsChangeSet.getAddValues().map(permission => ({
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
    history.push(`/${organizationId}`);
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

NewOrganizationRole.propTypes = {
  organizationId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(NewOrganizationRole);

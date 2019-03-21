import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import { Redirect, withRouter } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import { UpdateOrganizationRole } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import useOrganizationRoleForm from './useOrganizationRoleForm';
import useQuerySuspended from '../useQuerySuspended';

function EditOrganizationRole({ organizationId, organizationRoleId, history }) {
  const { data, error } = useQuerySuspended(OrganizationAdminOrganizationsQuery);
  const organization = data.organizations.find(org => org.id === organizationId);
  const initialOrganizationRole = organization.organization_roles
    .find(role => role.id === organizationRoleId);
  const { renderForm, formState } = useOrganizationRoleForm(initialOrganizationRole);
  const [mutate, mutationError, mutationInProgress] = useAsyncFunction(
    useMutation(UpdateOrganizationRole),
  );

  if (error) return <ErrorDisplay graphQLError={error} />;
  if (!organization.current_ability_can_manage_access) {
    return <Redirect to="/" />;
  }

  const updateOrganizationRole = async ({
    organizationRole, usersChangeSet, permissionsChangeSet,
  }) => {
    await mutate({
      variables: {
        id: organizationRoleId,
        name: organizationRole.name,
        addUserIds: usersChangeSet.getAddValues().map(user => user.id),
        removeUserIds: usersChangeSet.getRemoveIds(),
        addPermissions: permissionsChangeSet.getAddValues().map(permission => ({
          permission: permission.permission,
        })),
        removePermissionIds: permissionsChangeSet.getRemoveIds(),
      },
    });

    history.push(`/${organizationId}`);
  };

  return (
    <>
      <h1 className="mb-4">
        {'Edit role '}
        {formState.organizationRole.name}
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

EditOrganizationRole.propTypes = {
  organizationId: PropTypes.number.isRequired,
  organizationRoleId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EditOrganizationRole);

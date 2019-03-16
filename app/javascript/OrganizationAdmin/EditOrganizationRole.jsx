import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import { withRouter } from 'react-router-dom';

import { UpdateOrganizationRole } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import useOrganizationRoleForm from './useOrganizationRoleForm';

function EditOrganizationRole({ organizationId, organizationRoleId, history }) {
  const { error, renderForm, formState } = useOrganizationRoleForm(
    ({ organizations }) => organizations.find(org => org.id === organizationId)
      .organization_roles.find(role => role.id === organizationRoleId),
  );
  const [mutate, mutationError, mutationInProgress] = useAsyncFunction(
    useMutation(UpdateOrganizationRole),
  );

  if (error) return <ErrorDisplay graphQLError={error} />;

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

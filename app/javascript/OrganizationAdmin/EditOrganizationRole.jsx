import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import { UpdateOrganizationRole } from './mutations.gql';
import useOrganizationRoleForm from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditOrganizationRoleForm({ initialOrganizationRole, organization }) {
  const history = useHistory();
  const { renderForm, formState } = useOrganizationRoleForm(initialOrganizationRole);
  const [
    mutate, { error: mutationError, loading: mutationInProgress },
  ] = useMutation(UpdateOrganizationRole);

  usePageTitle(`Editing “${initialOrganizationRole.name}”`);
  const updateOrganizationRole = async ({
    name, usersChangeSet, permissionsChangeSet,
  }) => {
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

    history.push(`/organizations/${organization.id}`);
  };

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

EditOrganizationRoleForm.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  initialOrganizationRole: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function EditOrganizationRole() {
  const params = useParams();
  const organizationId = Number.parseInt(params.organizationId, 10);
  const organizationRoleId = Number.parseInt(params.organizationRoleId, 10);
  const { data, loading, error } = useQuery(OrganizationAdminOrganizationsQuery);
  const organization = useMemo(
    () => (error || loading ? null : data.organizations.find((org) => org.id === organizationId)),
    [data, error, loading, organizationId],
  );
  const initialOrganizationRole = useMemo(
    () => (organization
      ? organization.organization_roles.find((role) => role.id === organizationRoleId)
      : null),
    [organization, organizationRoleId],
  );

  if (loading) return <PageLoadingIndicator visible />;
  if (error) return <ErrorDisplay graphQLError={error} />;
  if (!organization.current_ability_can_manage_access) {
    return <Redirect to="/organizations" />;
  }

  return (
    <EditOrganizationRoleForm
      initialOrganizationRole={initialOrganizationRole}
      organization={organization}
    />
  );
}

export default EditOrganizationRole;

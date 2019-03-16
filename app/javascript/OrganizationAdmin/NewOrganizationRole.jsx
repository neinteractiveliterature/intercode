import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { flatMap } from 'lodash';
import { withRouter } from 'react-router-dom';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { CreateOrganizationRole } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import { Transforms, useMutator } from '../ComposableFormUtils';
import { useChangeSet, useChangeSetWithSelect } from '../ChangeSet';
import UserSelect from '../BuiltInFormControls/UserSelect';
import PermissionNames from '../../../config/permission_names.json';
import PermissionsTableInput from '../BuiltInFormControls/PermissionsTableInput';

const OrganizationRolePermissionNames = flatMap(
  PermissionNames.filter(
    permissionNameGroup => permissionNameGroup.role_type === 'OrganizationRole',
  ),
  permissionNameGroup => permissionNameGroup.permissions,
);

function NewOrganizationRole({ organizationId, history }) {
  const { data, error } = useQuery(OrganizationAdminOrganizationsQuery);
  const [organizationRole, organizationRoleMutator] = useMutator(
    { name: '', users: [], permissions: [] },
    {
      name: Transforms.textInputChange,
    },
  );
  const [usersChangeSet, onChangeUsers] = useChangeSetWithSelect();
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet();
  const [mutationError, setMutationError] = useState(null);
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const mutate = useMutation(CreateOrganizationRole);

  if (error) return <ErrorDisplay graphQLError={error} />;

  const initialPermissions = organizationRole.permissions
    .map(permission => ({ ...permission, model: organizationRole }));
  const organization = data.organizations.find(org => org.id === organizationId);

  const createOrganizationRoleClicked = async () => {
    setMutationInProgress(true);
    try {
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
      history.push(`/${organizationId}`);
    } catch (e) {
      setMutationError(e);
    } finally {
      setMutationInProgress(false);
    }
  };

  return (
    <>
      <h1 className="mb-4">
        New role in
        {' '}
        {organization.name}
      </h1>

      <BootstrapFormInput
        name="name"
        label="Role name"
        value={organizationRole.name}
        onChange={organizationRoleMutator.name}
      />

      <div className="form-group">
        <label htmlFor="users">Users</label>
        <UserSelect
          isMulti
          inputId="users"
          value={usersChangeSet.apply(organizationRole.users)}
          onChange={onChangeUsers}
        />
      </div>

      <fieldset>
        <caption>Permissions</caption>

        <PermissionsTableInput
          permissionNames={OrganizationRolePermissionNames}
          initialPermissions={initialPermissions}
          models={[organizationRole]}
          changeSet={permissionsChangeSet}
          add={addPermission}
          remove={removePermission}
          formatModelHeader={() => 'Permitted?'}
        />
      </fieldset>

      <ErrorDisplay graphQLError={mutationError} />

      <button
        className="btn btn-primary"
        type="button"
        onClick={createOrganizationRoleClicked}
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

import React, { useMemo } from 'react';
import { flatMap } from 'lodash';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

import { Transforms, useTransformedState } from '../ComposableFormUtils';
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

export default function useOrganizationRoleForm(initialOrganizationRole) {
  const [name, onNameChange] = useTransformedState(
    initialOrganizationRole.name,
    Transforms.textInputChange,
  );
  const [usersChangeSet, onChangeUsers] = useChangeSetWithSelect();
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet();

  const initialPermissions = useMemo(
    () => initialOrganizationRole.permissions
      .map(permission => ({ ...permission, model: initialOrganizationRole })),
    [initialOrganizationRole],
  );

  const users = useMemo(
    () => usersChangeSet.apply(initialOrganizationRole.users),
    [usersChangeSet, initialOrganizationRole],
  );

  const renderForm = () => (
    <>
      <BootstrapFormInput
        name="name"
        label="Role name"
        value={name}
        onChange={onNameChange}
      />

      <div className="form-group">
        <label htmlFor="users">Users</label>
        <UserSelect
          isMulti
          inputId="users"
          value={users}
          onChange={onChangeUsers}
        />
      </div>

      <fieldset>
        <caption>Permissions</caption>

        <PermissionsTableInput
          permissionNames={OrganizationRolePermissionNames}
          initialPermissions={initialPermissions}
          models={[initialOrganizationRole]}
          changeSet={permissionsChangeSet}
          add={addPermission}
          remove={removePermission}
          formatModelHeader={() => 'Permitted?'}
        />
      </fieldset>
    </>
  );

  return {
    renderForm,
    formState: {
      name,
      usersChangeSet,
      permissionsChangeSet,
    },
  };
}

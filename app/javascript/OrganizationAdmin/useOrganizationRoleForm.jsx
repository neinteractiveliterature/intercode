import React, { useMemo, useState } from 'react';
import flatMap from 'lodash-es/flatMap';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

import { useChangeSet, useChangeSetWithSelect } from '../ChangeSet';
import UserSelect from '../BuiltInFormControls/UserSelect';
import PermissionNames from '../../../config/permission_names.json';
import PermissionsTableInput from '../Permissions/PermissionsTableInput';

const OrganizationRolePermissionNames = flatMap(
  PermissionNames.filter(
    (permissionNameGroup) => permissionNameGroup.role_type === 'OrganizationRole',
  ),
  (permissionNameGroup) => permissionNameGroup.permissions,
);

export default function useOrganizationRoleForm(initialOrganizationRole) {
  const [name, onNameChange] = useState(initialOrganizationRole.name);
  const [usersChangeSet, onChangeUsers] = useChangeSetWithSelect();
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet();

  const initialPermissions = useMemo(
    () => initialOrganizationRole.permissions
      .map((permission) => ({ ...permission, model: initialOrganizationRole })),
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
        onTextChange={onNameChange}
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

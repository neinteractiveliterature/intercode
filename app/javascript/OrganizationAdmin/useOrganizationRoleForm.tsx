import React, { useMemo, useState } from 'react';
import flatMap from 'lodash/flatMap';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

import { useChangeSet, useChangeSetWithSelect } from '../ChangeSet';
import UserSelect from '../BuiltInFormControls/UserSelect';
import PermissionNames from '../../../config/permission_names.json';
import PermissionsTableInput from '../Permissions/PermissionsTableInput';
import { OrganizationAdminOrganizationsQueryQuery } from './queries.generated';
import { PermissionWithId } from '../Permissions/usePermissionsChangeSet';

const OrganizationRolePermissionNames = flatMap(
  PermissionNames.filter(
    (permissionNameGroup) => permissionNameGroup.role_type === 'OrganizationRole',
  ),
  (permissionNameGroup) => permissionNameGroup.permissions,
);

type OrganizationRoleType = OrganizationAdminOrganizationsQueryQuery['organizations'][0]['organization_roles'][0];

export default function useOrganizationRoleForm(initialOrganizationRole: OrganizationRoleType) {
  const [name, onNameChange] = useState(initialOrganizationRole.name);
  const [usersChangeSet, onChangeUsers] = useChangeSetWithSelect<
    OrganizationRoleType['users'][0]
  >();
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet<PermissionWithId>();

  const initialPermissions = useMemo(
    () =>
      initialOrganizationRole.permissions.map((permission) => ({
        ...permission,
        role: initialOrganizationRole,
      })),
    [initialOrganizationRole],
  );

  const users = useMemo(() => usersChangeSet.apply(initialOrganizationRole.users), [
    usersChangeSet,
    initialOrganizationRole,
  ]);

  const renderForm = () => (
    <>
      <BootstrapFormInput name="name" label="Role name" value={name} onTextChange={onNameChange} />

      <div className="form-group">
        <label htmlFor="users">Users</label>
        <UserSelect isMulti inputId="users" value={users} onChange={onChangeUsers} />
      </div>

      <fieldset>
        <caption>Permissions</caption>

        <PermissionsTableInput
          permissionNames={OrganizationRolePermissionNames}
          initialPermissions={initialPermissions}
          rowType="role"
          rows={[initialOrganizationRole]}
          changeSet={permissionsChangeSet}
          add={addPermission}
          remove={removePermission}
          formatRowHeader={() => 'Permitted?'}
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
  } as const;
}

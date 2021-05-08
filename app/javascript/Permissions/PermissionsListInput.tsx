import * as React from 'react';
import { titleize } from 'inflected';

import PermissionCheckBox from './PermissionCheckBox';
import usePermissionsChangeSet, { UsePermissionsChangeSetOptions } from './usePermissionsChangeSet';
import usePermissionToggle, { UsePermissionToggleOptions } from './usePermissionToggle';
import { PolymorphicPermission } from './PermissionUtils';

type PermissionsListRowProps = Omit<UsePermissionToggleOptions, 'role'> & {
  name: string;
};

function PermissionsListRow({
  grantPermission,
  revokePermission,
  model,
  permission,
  name,
  initialPermissions,
  changeSet,
  currentPermissions,
  readOnly,
}: PermissionsListRowProps) {
  const { toggle, hasPermission, className } = usePermissionToggle({
    grantPermission,
    revokePermission,
    model,
    permission,
    initialPermissions,
    changeSet,
    currentPermissions,
    readOnly,
  });

  return (
    <tr
      className={`${className} cursor-pointer`}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.keyCode === 32 || event.keyCode === 13) {
          toggle();
        }
      }}
    >
      <th scope="row" className="text-left font-weight-normal pe-4">
        {titleize(name)}
      </th>
      <td>
        <PermissionCheckBox hasPermission={hasPermission} />
      </td>
    </tr>
  );
}

export type PermissionsListInputProps = UsePermissionsChangeSetOptions & {
  model: PolymorphicPermission['model'];
  permissionNames: { permission: string; name: string }[];
  header?: React.ReactNode;
  readOnly?: boolean;
};

function PermissionsListInput({
  permissionNames,
  initialPermissions,
  model,
  changeSet,
  add,
  remove,
  header,
  readOnly,
}: PermissionsListInputProps) {
  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions,
    changeSet,
    add,
    remove,
  });

  return (
    <table className="table table-hover table-sm table-striped w-auto" role="grid">
      <thead>
        <tr>
          <th colSpan={2}>{header}</th>
        </tr>
      </thead>

      <tbody>
        {permissionNames.map(({ permission, name }) => (
          <PermissionsListRow
            key={permission}
            initialPermissions={initialPermissions}
            currentPermissions={currentPermissions}
            changeSet={changeSet}
            model={model}
            permission={permission}
            name={name}
            grantPermission={grantPermission}
            revokePermission={revokePermission}
            readOnly={readOnly ?? false}
          />
        ))}
      </tbody>
    </table>
  );
}

export default PermissionsListInput;

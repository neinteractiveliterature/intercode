import * as React from 'react';
import capitalize from 'lodash/capitalize';

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
}: PermissionsListRowProps): JSX.Element {
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
      <th scope="row" className="text-start fw-normal pe-4">
        {capitalize(name)}
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
}: PermissionsListInputProps): JSX.Element {
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

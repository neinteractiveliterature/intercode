import React from 'react';
import { titleize } from 'inflected';
import classNames from 'classnames';

import PermissionsTableCell from './PermissionsTableCell';
import usePermissionsChangeSet, { UsePermissionsChangeSetOptions } from './usePermissionsChangeSet';

type PermissionName = {
  name: string;
  permission: string;
};

type PermissionsTableInputProps<RowType extends { id: number }> = UsePermissionsChangeSetOptions & {
  permissionNames: PermissionName[];
  rows: RowType[];
  rowType: 'model' | 'role';
  formatRowHeader: (row: RowType) => React.ReactNode;
  rowsHeader?: React.ReactNode;
  readOnly?: boolean;
};

function PermissionsTableInput<RowType extends { id: number }>({
  permissionNames,
  initialPermissions,
  changeSet,
  add,
  remove,
  rowsHeader,
  formatRowHeader,
  readOnly,
  rows,
  rowType,
}: PermissionsTableInputProps<RowType>) {
  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions,
    changeSet,
    add,
    remove,
  });

  return (
    <table
      className={classNames('table table-responsive', { 'table-hover-cell': !readOnly })}
      role="grid"
    >
      <thead>
        <tr>
          <th>{rowsHeader}</th>
          {permissionNames.map(({ permission, name }) => (
            <th key={permission} className="text-center">
              {titleize(name)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row">{formatRowHeader(row)}</th>
            {permissionNames.map(({ permission }) => (
              <PermissionsTableCell
                key={permission}
                initialPermissions={initialPermissions}
                currentPermissions={currentPermissions}
                changeSet={changeSet}
                rowType={rowType}
                model={rowType === 'model' ? row : undefined}
                role={rowType === 'role' ? row : undefined}
                permission={permission}
                grantPermission={grantPermission}
                revokePermission={revokePermission}
                readOnly={readOnly ?? false}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PermissionsTableInput;

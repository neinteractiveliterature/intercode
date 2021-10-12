import * as React from 'react';
import { titleize } from 'inflected';
import classNames from 'classnames';

import PermissionsTableCell from './PermissionsTableCell';
import usePermissionsChangeSet, { UsePermissionsChangeSetOptions } from './usePermissionsChangeSet';
import { PermissionedModel, PermissionedRole } from '../graphqlTypes.generated';

type PermissionName = {
  name: string;
  permission: string;
};

type BaseRowType =
  | (Pick<PermissionedModel, '__typename'> & { id: string })
  | (Pick<PermissionedRole, '__typename'> & { id: string });

type PermissionsTableInputProps<RowType extends BaseRowType> = UsePermissionsChangeSetOptions & {
  permissionNames: PermissionName[];
  rows: RowType[];
  rowType: 'model' | 'role';
  formatRowHeader: (row: RowType) => React.ReactNode;
  rowsHeader?: React.ReactNode;
  readOnly?: boolean;
};

function PermissionsTableInput<RowType extends BaseRowType>({
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
}: PermissionsTableInputProps<RowType>): JSX.Element {
  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions,
    changeSet,
    add,
    remove,
  });

  return (
    <table className={classNames('table table-responsive', { 'table-hover-cell': !readOnly })} role="grid">
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
                model={
                  rowType === 'model' ? (row as Pick<PermissionedModel, '__typename'> & { id: string }) : undefined
                }
                role={rowType === 'role' ? (row as Pick<PermissionedRole, '__typename'> & { id: string }) : undefined}
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

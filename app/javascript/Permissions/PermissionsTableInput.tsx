import * as React from 'react';
import capitalize from 'lodash/capitalize';
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

type PermissionsTableInputBaseProps<RowsType extends BaseRowType[]> = UsePermissionsChangeSetOptions & {
  permissionNames: PermissionName[];
  rows: RowsType;
  formatRowHeader: (row: RowsType[number]) => React.ReactNode;
  rowsHeader?: React.ReactNode;
  readOnly?: boolean;
};

type PermissionsTableInputRoleRowProps<RowsType extends (Pick<PermissionedRole, '__typename'> & { id: string })[]> =
  PermissionsTableInputBaseProps<RowsType> & {
    rowType: 'role';
    // for some role types (e.g. OrganizationRole) there is no model; we want an explicit undefined
    // prop for this
    model: (Pick<PermissionedModel, '__typename'> & { id: string }) | undefined;
  };

type PermissionsTableInputModelRowProps<RowsType extends (Pick<PermissionedModel, '__typename'> & { id: string })[]> =
  PermissionsTableInputBaseProps<RowsType> & {
    rowType: 'model';
    role: Pick<PermissionedRole, '__typename'> & { id: string };
  };

type PermissionsTableInputProps<RowsType extends BaseRowType[]> = RowsType extends (Pick<
  PermissionedModel,
  '__typename'
> & {
  id: string;
})[]
  ? PermissionsTableInputModelRowProps<RowsType>
  : RowsType extends (Pick<PermissionedRole, '__typename'> & {
        id: string;
      })[]
    ? PermissionsTableInputRoleRowProps<RowsType>
    : never;

function PermissionsTableInput<RowsType extends BaseRowType[]>(
  props: PermissionsTableInputProps<RowsType>,
): JSX.Element {
  const { permissionNames, initialPermissions, changeSet, add, remove, rowsHeader, readOnly } = props;

  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions,
    changeSet,
    add,
    remove,
  });

  const buildCommonCellProperties = (permission: string) => ({
    initialPermissions: initialPermissions,
    currentPermissions: currentPermissions,
    changeSet: changeSet,
    permission: permission,
    grantPermission: grantPermission,
    revokePermission: revokePermission,
    readOnly: readOnly ?? false,
  });

  return (
    <table className={classNames('table table-responsive', { 'table-hover-cell': !readOnly })} role="grid">
      <thead>
        <tr>
          <th>{rowsHeader}</th>
          {permissionNames.map(({ permission, name }) => (
            <th key={permission} className="text-center">
              {capitalize(name)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {props.rowType === 'model'
          ? props.rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{props.formatRowHeader(row)}</th>
                {permissionNames.map(({ permission }) => (
                  <PermissionsTableCell
                    key={permission}
                    {...buildCommonCellProperties(permission)}
                    model={row}
                    role={props.role}
                  />
                ))}
              </tr>
            ))
          : props.rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{props.formatRowHeader(row)}</th>
                {permissionNames.map(({ permission }) => (
                  <PermissionsTableCell
                    key={permission}
                    {...buildCommonCellProperties(permission)}
                    model={props.model}
                    role={row}
                  />
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );
}

export default PermissionsTableInput;

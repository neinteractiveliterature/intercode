import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'inflected';
import classNames from 'classnames';

import PermissionsTableCell from './PermissionsTableCell';
import usePermissionsChangeSet from './usePermissionsChangeSet';
import {
  PermissionNamePropType, PermissionPropType, ModelPropType, RolePropType,
} from './PermissionPropTypes';

function PermissionsTableInput({
  permissionNames,
  initialPermissions,
  rowType,
  models,
  roles,
  changeSet,
  add,
  remove,
  rowsHeader,
  formatRowHeader,
  readOnly,
}) {
  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions, changeSet, add, remove,
  });

  const rows = rowType === 'role' ? roles : models;

  return (
    <table className={classNames('table table-responsive', { 'table-hover-cell': !readOnly })} role="grid">
      <thead>
        <tr>
          <th>{rowsHeader}</th>
          {
            permissionNames.map(({ permission, name }) => (
              <th key={permission} className="text-center">{titleize(name)}</th>
            ))
          }
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row">
              {formatRowHeader(row)}
            </th>
            {permissionNames.map(({ permission }) => (
              <PermissionsTableCell
                key={permission}
                initialPermissions={initialPermissions}
                currentPermissions={currentPermissions}
                changeSet={changeSet}
                rowType={rowType}
                model={rowType === 'model' ? row : null}
                role={rowType === 'role' ? row : null}
                permission={permission}
                grantPermission={grantPermission}
                revokePermission={revokePermission}
                readOnly={readOnly}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

PermissionsTableInput.propTypes = {
  permissionNames: PropTypes.arrayOf(PermissionNamePropType).isRequired,
  initialPermissions: PropTypes.arrayOf(PermissionPropType.isRequired).isRequired,
  rowType: PropTypes.oneOf(['model', 'role']).isRequired,
  models: PropTypes.arrayOf(ModelPropType),
  roles: PropTypes.arrayOf(RolePropType),
  changeSet: PropTypes.shape({
    apply: PropTypes.shape.isRequired,
  }).isRequired,
  add: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  rowsHeader: PropTypes.node,
  formatRowHeader: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

PermissionsTableInput.defaultProps = {
  rowsHeader: null,
  models: null,
  roles: null,
  readOnly: false,
};

export default PermissionsTableInput;

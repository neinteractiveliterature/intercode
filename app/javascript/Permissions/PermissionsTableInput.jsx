import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'inflected';

import PermissionsTableCell from './PermissionsTableCell';
import usePermissionsChangeSet from './usePermissionsChangeSet';
import { PermissionNamePropType, PermissionPropType, ModelPropType } from './PermissionPropTypes';

function PermissionsTableInput({
  permissionNames,
  initialPermissions,
  models,
  changeSet,
  add,
  remove,
  modelsHeader,
  formatModelHeader,
}) {
  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions, changeSet, add, remove,
  });

  return (
    <table className="table table-responsive table-hover-cell" role="grid">
      <thead>
        <tr>
          <th>{modelsHeader}</th>
          {
            permissionNames.map(({ permission, name }) => (
              <th key={permission} className="text-center">{titleize(name)}</th>
            ))
          }
        </tr>
      </thead>

      <tbody>
        {models.map(model => (
          <tr key={model.id}>
            <th scope="row">
              {formatModelHeader(model)}
            </th>
            {permissionNames.map(({ permission }) => (
              <PermissionsTableCell
                key={permission}
                initialPermissions={initialPermissions}
                currentPermissions={currentPermissions}
                changeSet={changeSet}
                model={model}
                permission={permission}
                grantPermission={grantPermission}
                revokePermission={revokePermission}
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
  models: PropTypes.arrayOf(ModelPropType).isRequired,
  changeSet: PropTypes.shape({
    apply: PropTypes.shape.isRequired,
  }).isRequired,
  add: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  modelsHeader: PropTypes.node,
  formatModelHeader: PropTypes.func.isRequired,
};

PermissionsTableInput.defaultProps = {
  modelsHeader: null,
};

export default PermissionsTableInput;

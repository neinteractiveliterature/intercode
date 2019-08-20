import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'inflected';

import PermissionCheckBox from './PermissionCheckBox';
import usePermissionsChangeSet from './usePermissionsChangeSet';
import { PermissionNamePropType, PermissionPropType, ModelPropType } from './PermissionPropTypes';
import usePermissionToggle from './usePermissionToggle';

function PermissionsListRow({
  grantPermission, revokePermission, model, permission, name, initialPermissions, changeSet,
  currentPermissions,
}) {
  const { toggle, hasPermission, className } = usePermissionToggle({
    grantPermission,
    revokePermission,
    model,
    permission,
    initialPermissions,
    changeSet,
    currentPermissions,
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
      <th scope="row" className="text-left font-weight-normal pr-4">
        {titleize(name)}
      </th>
      <td>
        <PermissionCheckBox hasPermission={hasPermission} />
      </td>
    </tr>
  );
}

PermissionsListRow.propTypes = {
  model: ModelPropType.isRequired,
  permission: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  initialPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  currentPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  changeSet: PropTypes.shape({
    changes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  grantPermission: PropTypes.func.isRequired,
  revokePermission: PropTypes.func.isRequired,
};

function PermissionsListInput({
  permissionNames,
  initialPermissions,
  model,
  changeSet,
  add,
  remove,
  header,
}) {
  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions, changeSet, add, remove,
  });

  return (
    <table className="table table-hover table-sm table-striped w-auto" role="grid">
      <thead>
        <tr>
          <th colSpan="2">{header}</th>
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
          />
        ))}
      </tbody>
    </table>
  );
}

PermissionsListInput.propTypes = {
  permissionNames: PropTypes.arrayOf(PermissionNamePropType).isRequired,
  initialPermissions: PropTypes.arrayOf(PermissionPropType.isRequired).isRequired,
  model: ModelPropType.isRequired,
  changeSet: PropTypes.shape({
    apply: PropTypes.shape.isRequired,
  }).isRequired,
  add: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  header: PropTypes.node,
};

PermissionsListInput.defaultProps = {
  header: null,
};

export default PermissionsListInput;

import React from 'react';
import PropTypes from 'prop-types';

import { ModelPropType, PermissionPropType } from './PermissionPropTypes';
import usePermissionToggle from './usePermissionToggle';
import PermissionCheckBox from './PermissionCheckBox';

function PermissionsTableCell({
  initialPermissions,
  currentPermissions,
  changeSet,
  model,
  permission,
  grantPermission,
  revokePermission,
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
    <td
      role="gridcell"
      className={className}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.keyCode === 32 || event.keyCode === 13) {
          toggle();
        }
      }}
    >
      <PermissionCheckBox hasPermission={hasPermission} />
    </td>
  );
}

PermissionsTableCell.propTypes = {
  model: ModelPropType.isRequired,
  permission: PropTypes.string.isRequired,
  initialPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  currentPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  changeSet: PropTypes.shape({
    changes: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  grantPermission: PropTypes.func.isRequired,
  revokePermission: PropTypes.func.isRequired,
};

export default PermissionsTableCell;

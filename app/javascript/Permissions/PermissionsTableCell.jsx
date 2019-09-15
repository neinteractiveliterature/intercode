import React from 'react';
import PropTypes from 'prop-types';

import { ModelPropType, PermissionPropType, RolePropType } from './PermissionPropTypes';
import usePermissionToggle from './usePermissionToggle';
import PermissionCheckBox from './PermissionCheckBox';

function PermissionsTableCell({
  initialPermissions,
  currentPermissions,
  changeSet,
  rowType,
  model,
  role,
  permission,
  grantPermission,
  revokePermission,
  readOnly,
}) {
  const { toggle, hasPermission, className } = usePermissionToggle({
    grantPermission,
    revokePermission,
    model: rowType === 'model' ? model : null,
    role: rowType === 'role' ? role : null,
    permission,
    initialPermissions,
    changeSet,
    readOnly,
    currentPermissions,
  });

  const toggleWithReadOnlyCheck = () => {
    if (!readOnly) {
      toggle();
    }
  };

  return (
    <td
      role="gridcell"
      className={className}
      tabIndex={readOnly ? null : 0}
      onClick={toggleWithReadOnlyCheck}
      onKeyDown={(event) => {
        if (event.keyCode === 32 || event.keyCode === 13) {
          toggleWithReadOnlyCheck();
        }
      }}
    >
      <PermissionCheckBox hasPermission={hasPermission} />
    </td>
  );
}

PermissionsTableCell.propTypes = {
  rowType: PropTypes.oneOf(['model', 'role']).isRequired,
  model: ModelPropType,
  role: RolePropType,
  permission: PropTypes.string.isRequired,
  initialPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  currentPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  changeSet: PropTypes.shape({
    changes: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  grantPermission: PropTypes.func.isRequired,
  revokePermission: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

PermissionsTableCell.defaultProps = {
  model: null,
  role: null,
  readOnly: false,
};

export default PermissionsTableCell;

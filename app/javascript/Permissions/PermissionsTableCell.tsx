import usePermissionToggle, { UsePermissionToggleOptions } from './usePermissionToggle';
import PermissionCheckBox from './PermissionCheckBox';

export type PermissionsTableCellProps = UsePermissionToggleOptions & {
  rowType: 'model' | 'role';
};

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
}: PermissionsTableCellProps): JSX.Element {
  const { toggle, hasPermission, className } = usePermissionToggle({
    grantPermission,
    revokePermission,
    model: rowType === 'model' ? model : undefined,
    role: rowType === 'role' ? role : undefined,
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
      tabIndex={readOnly ? undefined : 0}
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

export default PermissionsTableCell;

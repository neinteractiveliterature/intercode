import usePermissionToggle, { UsePermissionToggleOptions } from './usePermissionToggle';
import PermissionCheckBox from './PermissionCheckBox';

export type PermissionsTableCellProps = UsePermissionToggleOptions;

function PermissionsTableCell({
  initialPermissions,
  currentPermissions,
  changeSet,
  model,
  role,
  permission,
  grantPermission,
  revokePermission,
  readOnly,
}: PermissionsTableCellProps): React.JSX.Element {
  const { toggle, hasPermission, className } = usePermissionToggle({
    grantPermission,
    revokePermission,
    model,
    role,
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
        if (event.key === 'Enter' || event.key === ' ') {
          toggleWithReadOnlyCheck();
        }
      }}
    >
      <PermissionCheckBox hasPermission={hasPermission} />
    </td>
  );
}

export default PermissionsTableCell;

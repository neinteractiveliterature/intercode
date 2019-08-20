import { useMemo } from 'react';
import classNames from 'classnames';

import { findPermission, permissionEquals } from './PermissionUtils';

export default function usePermissionToggle({
  grantPermission, revokePermission, model, permission, initialPermissions,
  changeSet, currentPermissions,
}) {
  const setPermission = (value) => {
    if (value) {
      grantPermission(model, permission);
    } else {
      revokePermission(model, permission);
    }
  };

  const existingPermission = findPermission(
    initialPermissions, model, permission,
  );

  const hasPermission = (
    findPermission(currentPermissions, model, permission) != null
  );

  const toggle = () => setPermission(!hasPermission);

  const className = useMemo(
    () => classNames('cursor-pointer text-center align-middle', {
      'table-success': changeSet.changes.some(({ changeType, value }) => (
        changeType === 'add'
        && permissionEquals(value, { model, permission })
      )),
      'table-danger': (
        existingPermission
        && changeSet.changes.some(({ changeType, id }) => (
          changeType === 'remove'
          && existingPermission.id === id
        ))
      ),
    }),
    [changeSet, existingPermission, model, permission],
  );

  return { hasPermission, toggle, className };
}

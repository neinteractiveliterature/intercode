import { useMemo } from 'react';
import classNames from 'classnames';

import { findPermission, permissionEquals } from './PermissionUtils';

export default function usePermissionToggle({
  grantPermission, revokePermission, role, model, permission, initialPermissions,
  changeSet, currentPermissions, readOnly,
}) {
  const setPermission = (value) => {
    if (value) {
      grantPermission({ role, model, permission });
    } else {
      revokePermission({ role, model, permission });
    }
  };

  const existingPermission = findPermission(
    initialPermissions, { role, model, permission },
  );

  const hasPermission = (
    findPermission(currentPermissions, { role, model, permission }) != null
  );

  const toggle = () => setPermission(!hasPermission);

  const className = useMemo(
    () => classNames('text-center align-middle', {
      'cursor-pointer': !readOnly,
      'table-success': changeSet && changeSet.changes.some(({ changeType, value }) => (
        changeType === 'add'
        && permissionEquals(value, { role, model, permission })
      )),
      'table-danger': (
        existingPermission
        && changeSet && changeSet.changes.some(({ changeType, id }) => (
          changeType === 'remove'
          && existingPermission.id === id
        ))
      ),
    }),
    [changeSet, readOnly, existingPermission, role, model, permission],
  );

  return { hasPermission, toggle, className };
}

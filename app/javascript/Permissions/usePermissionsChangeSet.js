import { useCallback, useMemo } from 'react';

import { permissionEquals, findPermission } from './PermissionUtils';

export default function usePermissionsChangeSet({
  initialPermissions, changeSet, add, remove,
}) {
  const currentPermissions = useMemo(
    () => changeSet.apply(initialPermissions),
    [changeSet, initialPermissions],
  );

  const grantPermission = useCallback(
    ({ role, model, permission }) => {
      add(
        { role, model, permission },
        initialPermissions,
        permissionEquals,
      );
    },
    [add, initialPermissions],
  );

  const revokePermission = useCallback(
    ({ role, model, permission }) => {
      const permissionId = findPermission(currentPermissions, { role, model, permission }).id;

      remove(permissionId);
    },
    [currentPermissions, remove],
  );

  return { currentPermissions, grantPermission, revokePermission };
}

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
    (model, permission) => {
      add(
        { model, permission },
        initialPermissions,
        permissionEquals,
      );
    },
    [add, initialPermissions],
  );

  const revokePermission = useCallback(
    (model, permission) => {
      const permissionId = findPermission(currentPermissions, model, permission).id;

      remove(permissionId);
    },
    [currentPermissions, remove],
  );

  return { currentPermissions, grantPermission, revokePermission };
}

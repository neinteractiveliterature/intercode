import { useCallback, useMemo } from 'react';
import ChangeSet from '../ChangeSet';

import { permissionEquals, findPermission, PartialPolymorphicPermission } from './PermissionUtils';

export type PermissionWithId = PartialPolymorphicPermission & { id: string };

export type UsePermissionsChangeSetOptions = {
  initialPermissions: PermissionWithId[];
  changeSet?: ChangeSet<PermissionWithId>;
  add?: (
    permission: PartialPolymorphicPermission,
    initialPermissions: PermissionWithId[],
    isEqual: (a: PartialPolymorphicPermission, b: PartialPolymorphicPermission) => boolean,
  ) => void;
  remove?: (id: string) => void;
};

export type UsePermissionsChangeSetResult = {
  currentPermissions: PermissionWithId[];
  grantPermission: (permission: PartialPolymorphicPermission) => void;
  revokePermission: (permission: PartialPolymorphicPermission) => void;
};

export default function usePermissionsChangeSet({
  initialPermissions,
  changeSet,
  add,
  remove,
}: UsePermissionsChangeSetOptions): UsePermissionsChangeSetResult {
  const currentPermissions = useMemo(
    () => (changeSet ? changeSet.apply(initialPermissions) : initialPermissions),
    [changeSet, initialPermissions],
  );

  const grantPermission = useCallback(
    ({ role, model, permission }: PartialPolymorphicPermission) => {
      if (!add) {
        return;
      }

      add({ role, model, permission }, initialPermissions, permissionEquals);
    },
    [add, initialPermissions],
  );

  const revokePermission = useCallback(
    ({ role, model, permission }: PartialPolymorphicPermission) => {
      if (!remove) {
        return;
      }

      const permissionId = findPermission(currentPermissions, { role, model, permission })?.id;

      if (permissionId != null) {
        remove(permissionId);
      }
    },
    [currentPermissions, remove],
  );

  return { currentPermissions, grantPermission, revokePermission } as const;
}

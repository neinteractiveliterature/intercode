import { useMemo } from 'react';
import classNames from 'classnames';

import { findPermission, PartialPolymorphicPermission, permissionEquals } from './PermissionUtils';
import { UsePermissionsChangeSetOptions, UsePermissionsChangeSetResult } from './usePermissionsChangeSet';

export type UsePermissionToggleOptions = UsePermissionsChangeSetResult &
  Pick<UsePermissionsChangeSetOptions, 'initialPermissions' | 'changeSet'> &
  PartialPolymorphicPermission & {
    readOnly: boolean;
  };

export type UsePermissionToggleResult = {
  hasPermission: boolean;
  toggle: () => void;
  className: string;
  granted: boolean;
  revoked: boolean;
};

export default function usePermissionToggle({
  grantPermission,
  revokePermission,
  role,
  model,
  permission,
  initialPermissions,
  changeSet,
  currentPermissions,
  readOnly,
}: UsePermissionToggleOptions): UsePermissionToggleResult {
  const setPermission = (value: boolean) => {
    if (value) {
      grantPermission({ role, model, permission });
    } else {
      revokePermission({ role, model, permission });
    }
  };

  const existingPermission = findPermission(initialPermissions, { role, model, permission });

  const hasPermission = findPermission(currentPermissions, { role, model, permission }) != null;

  const toggle = () => setPermission(!hasPermission);

  const granted = useMemo(
    () =>
      (changeSet &&
        changeSet.changes.some(
          (change) => change.changeType === 'add' && permissionEquals(change.value, { role, model, permission }),
        )) ??
      false,
    [changeSet, model, permission, role],
  );

  const revoked = useMemo(
    () =>
      (existingPermission &&
        changeSet &&
        changeSet.changes.some((change) => change.changeType === 'remove' && existingPermission.id === change.id)) ??
      false,
    [existingPermission, changeSet],
  );

  const className = useMemo(
    () =>
      classNames('text-center align-middle', {
        'cursor-pointer': !readOnly,
        'table-success': granted,
        'table-danger': revoked,
      }),
    [readOnly, granted, revoked],
  );

  return { hasPermission, toggle, className, granted, revoked };
}

export function modelEquals(a, b) {
  return (
    a.__typename === b.__typename
    && a.id === b.id
  );
}

export function permissionEquals(a, b) {
  return modelEquals(a.model, b.model) && a.permission === b.permission;
}

export function findPermission(currentPermissions, model, permission) {
  return currentPermissions.find(currentPermission => (
    permissionEquals(currentPermission, { model, permission })
  ));
}

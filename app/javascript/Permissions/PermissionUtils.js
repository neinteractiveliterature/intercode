import flatMap from 'lodash/flatMap';

import PermissionNames from '../../../config/permission_names.json';

function polymorphicObjectEquals(a, b) {
  return (a == null && b == null) || (
    a.__typename === b.__typename
    && a.id === b.id
  );
}

const modelEquals = polymorphicObjectEquals;
const roleEquals = polymorphicObjectEquals;

export { modelEquals, roleEquals };

export function permissionEquals(a, b) {
  return modelEquals(a.model, b.model)
    && roleEquals(a.role, b.role)
    && a.permission === b.permission;
}

export function findPermission(currentPermissions, { role, model, permission }) {
  return currentPermissions.find((currentPermission) => (
    permissionEquals(currentPermission, { role, model, permission })
  ));
}

export function buildPermissionInput(permission) {
  return {
    model_type: (permission.model || {}).__typename,
    model_id: (permission.model || {}).id,
    role_type: (permission.role || {}).__typename,
    role_id: (permission.role || {}).id,
    permission: permission.permission,
  };
}

export function getPermissionNamesForModelType(modelType) {
  return flatMap(
    PermissionNames.filter(
      (permissionNameGroup) => permissionNameGroup.model_type === modelType,
    ),
    (permissionNameGroup) => permissionNameGroup.permissions,
  );
}

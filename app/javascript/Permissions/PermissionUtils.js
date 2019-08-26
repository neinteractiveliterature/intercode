import flatMap from 'lodash-es/flatMap';

import PermissionNames from '../../../config/permission_names.json';

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
  return currentPermissions.find((currentPermission) => (
    permissionEquals(currentPermission, { model, permission })
  ));
}

export function buildPermissionInput(permission) {
  return {
    model_type: permission.model.__typename,
    model_id: permission.model.id,
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

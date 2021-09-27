import flatMap from 'lodash/flatMap';

import PermissionNames from '../../../config/permission_names.json';
import {
  Permission,
  PermissionedModel,
  PermissionedModelTypeIndicator,
  PermissionedRole,
  PermissionedRoleTypeIndicator,
  PermissionInput,
} from '../graphqlTypes.generated';

type PolymorphicObject = { __typename?: string; id: number };

function polymorphicObjectEquals(
  a: PolymorphicObject | null | undefined,
  b: PolymorphicObject | null | undefined,
): boolean {
  return (a == null && b == null) || (a?.__typename === b?.__typename && a?.id === b?.id);
}

const modelEquals = polymorphicObjectEquals;
const roleEquals = polymorphicObjectEquals;

export { modelEquals, roleEquals };

export type PolymorphicPermission = Pick<Permission, 'permission'> & {
  role: Pick<PermissionedRole, '__typename' | 'id'>;
  model: Pick<PermissionedModel, '__typename' | 'id'>;
};

export type PartialPolymorphicPermission = Pick<PolymorphicPermission, 'permission'> &
  Partial<Pick<PolymorphicPermission, 'role' | 'model'>>;

export function permissionEquals(
  a: PartialPolymorphicPermission,
  b: PartialPolymorphicPermission,
): boolean {
  return (
    modelEquals(a.model, b.model) && roleEquals(a.role, b.role) && a.permission === b.permission
  );
}

export function findPermission<T extends PartialPolymorphicPermission>(
  currentPermissions: T[],
  { role, model, permission }: PartialPolymorphicPermission,
): T | undefined {
  return currentPermissions.find((currentPermission) =>
    permissionEquals(currentPermission, { role, model, permission }),
  );
}

function getModelTypeIndicatorForPermission(permission: PartialPolymorphicPermission) {
  switch (permission.model?.__typename) {
    case 'CmsContentGroup':
      return PermissionedModelTypeIndicator.CmsContentGroup;
    case 'Convention':
      return PermissionedModelTypeIndicator.Convention;
    case 'EventCategory':
      return PermissionedModelTypeIndicator.EventCategory;
    default:
      return undefined;
  }
}

function getRoleTypeIndicatorForPermission(permission: PartialPolymorphicPermission) {
  switch (permission.role?.__typename) {
    case 'OrganizationRole':
      return PermissionedRoleTypeIndicator.OrganizationRole;
    case 'StaffPosition':
      return PermissionedRoleTypeIndicator.StaffPosition;
    default:
      return undefined;
  }
}

export function buildPermissionInput(permission: PartialPolymorphicPermission): PermissionInput {
  return {
    model_type: getModelTypeIndicatorForPermission(permission),
    model_id: permission.model?.id,
    role_type: getRoleTypeIndicatorForPermission(permission),
    role_id: permission.role?.id,
    permission: permission.permission,
  };
}

export function getPermissionNamesForModelType(
  modelType: PermissionedModelTypeIndicator,
): { permission: string; name: string }[] {
  return flatMap(
    PermissionNames.filter((permissionNameGroup) => permissionNameGroup.model_type === modelType),
    (permissionNameGroup) => permissionNameGroup.permissions,
  );
}

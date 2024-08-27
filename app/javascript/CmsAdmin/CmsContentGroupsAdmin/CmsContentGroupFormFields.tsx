import { useMemo, useState } from 'react';
import * as React from 'react';
import uniqWith from 'lodash/uniqWith';
import { BootstrapFormInput, FormGroupWithLabel, notEmpty } from '@neinteractiveliterature/litform';

import CmsContentSelect, { CmsContentOption } from './CmsContentSelect';
import PermissionsTableInput from '../../Permissions/PermissionsTableInput';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { permissionEquals, getPermissionNamesForModelType } from '../../Permissions/PermissionUtils';
import { CmsContentGroupsAdminQueryData } from './queries.generated';
import ChangeSet from '../../ChangeSet';
import { PermissionedModelTypeIndicator } from '../../graphqlTypes.generated';
import { UsePermissionsChangeSetOptions } from '../../Permissions/usePermissionsChangeSet';
import assertNever from 'assert-never';

const ContentGroupPermissionNames = getPermissionNamesForModelType(PermissionedModelTypeIndicator.CmsContentGroup);

type ContentGroupTypeWithRequiredId = CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][0];
type ContentGroupType = Omit<ContentGroupTypeWithRequiredId, 'id'> &
  Partial<Pick<ContentGroupTypeWithRequiredId, 'id'>>;
type PermissionType = ContentGroupType['permissions'][0];
type RoleType = PermissionType['role'];

export type CmsContentGroupFormFieldsProps = {
  contentGroup: ContentGroupType;
  convention: CmsContentGroupsAdminQueryData['convention'];
  setContentGroup?: React.Dispatch<ContentGroupType>;
  disabled?: boolean;
  readOnly?: boolean;
  permissionsChangeSet?: ChangeSet<PermissionType>;
  addPermission?: React.Dispatch<Pick<PermissionType, 'role' | 'model' | 'permission'>>;
  removePermission?: UsePermissionsChangeSetOptions['remove'];
};

function CmsContentGroupFormFields({
  contentGroup,
  setContentGroup,
  disabled,
  readOnly,
  convention,
  permissionsChangeSet,
  addPermission,
  removePermission,
}: CmsContentGroupFormFieldsProps): JSX.Element {
  const [roles, setRoles] = useState<RoleType[]>(() => {
    const permissions = uniqWith<PermissionType>(contentGroup.permissions, permissionEquals);
    return permissions.map((permission) => permission.role).filter(notEmpty);
  });

  const contentGroupWithIdForPermissionTable: ContentGroupTypeWithRequiredId = useMemo(
    () => ({
      ...contentGroup,
      id: contentGroup.id ?? 'unsaved',
    }),
    [contentGroup],
  );

  const addRole = (role: RoleType) => {
    if (!addPermission) {
      return;
    }

    setRoles((prevStaffPositions) => [...prevStaffPositions, role]);
    ContentGroupPermissionNames.forEach((permissionName) => {
      addPermission({ role, model: contentGroupWithIdForPermissionTable, permission: permissionName.permission });
    });
  };

  return (
    <>
      <BootstrapFormInput
        label="Name"
        name="name"
        value={contentGroup.name}
        onTextChange={(name) => setContentGroup && setContentGroup({ ...contentGroup, name })}
        disabled={disabled}
        readOnly={readOnly}
      />

      <FormGroupWithLabel label="Contents">
        {(id) => (
          <CmsContentSelect
            isMulti
            name="contents"
            value={contentGroup.contents}
            inputId={id}
            onChange={(contents: CmsContentOption[]) =>
              setContentGroup && setContentGroup({ ...contentGroup, contents })
            }
            isDisabled={disabled || readOnly}
          />
        )}
      </FormGroupWithLabel>

      <section className="my-4 card">
        <div className="card-header">Permissions</div>

        <div className="card-body">
          {roles.length > 0 && (
            <PermissionsTableInput
              permissionNames={ContentGroupPermissionNames}
              initialPermissions={contentGroup.permissions}
              rowType="role"
              model={contentGroupWithIdForPermissionTable}
              rows={roles}
              formatRowHeader={(role) => {
                if (role.__typename === 'StaffPosition' || role.__typename === 'OrganizationRole') {
                  return role.name;
                }
                assertNever(role);
              }}
              readOnly={readOnly}
              changeSet={permissionsChangeSet}
              add={addPermission}
              remove={removePermission}
            />
          )}

          {!readOnly && (
            <SelectWithLabel<RoleType>
              label="Add staff position"
              options={convention?.staff_positions ?? []}
              getOptionValue={(staffPosition) => staffPosition.id.toString()}
              getOptionLabel={(staffPosition) => staffPosition.name}
              onChange={addRole}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default CmsContentGroupFormFields;

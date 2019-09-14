import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqWith from 'lodash-es/uniqWith';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';
import CmsContentSelect from './CmsContentSelect';
import PermissionsTableInput from '../../Permissions/PermissionsTableInput';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { permissionEquals, getPermissionNamesForModelType } from '../../Permissions/PermissionUtils';
import { PermissionPropType } from '../../Permissions/PermissionPropTypes';

const ContentGroupPermissionNames = getPermissionNamesForModelType('CmsContentGroup');

function CmsContentGroupFormFields({
  contentGroup, setContentGroup, disabled, convention,
  permissionsChangeSet, addPermission, removePermission,
}) {
  const [staffPositions, setStaffPositions] = useState(
    () => uniqWith(
      contentGroup.permissions.map((perm) => perm.role),
      permissionEquals,
    ),
  );

  const addStaffPosition = (staffPosition) => {
    setStaffPositions((prevStaffPositions) => [...prevStaffPositions, staffPosition]);
    ContentGroupPermissionNames.forEach((permissionName) => {
      addPermission({ role: staffPosition, permission: permissionName.permission });
    });
  };

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={contentGroup.name}
        onTextChange={(name) => setContentGroup({ ...contentGroup, name })}
        disabled={disabled}
      />

      <FormGroupWithLabel label="Contents" name="contents">
        {(id) => (
          <CmsContentSelect
            isMulti
            value={contentGroup.contents}
            inputId={id}
            onChange={(contents) => setContentGroup({ ...contentGroup, contents })}
            disabled={disabled}
          />
        )}
      </FormGroupWithLabel>

      <section className="my-4 card">
        <div className="card-header">
          Permissions
        </div>

        <div className="card-body">
          {staffPositions.length > 0 && (
            <PermissionsTableInput
              permissionNames={ContentGroupPermissionNames}
              initialPermissions={contentGroup.permissions}
              rowType="role"
              roles={staffPositions}
              changeSet={permissionsChangeSet}
              add={addPermission}
              remove={removePermission}
              formatRowHeader={(staffPosition) => staffPosition.name}
            />
          )}

          <SelectWithLabel
            label="Add staff position"
            options={convention.staff_positions}
            getOptionValue={(staffPosition) => staffPosition.id}
            getOptionLabel={(staffPosition) => staffPosition.name}
            onChange={addStaffPosition}
          />
        </div>
      </section>
    </>
  );
}

CmsContentGroupFormFields.propTypes = {
  contentGroup: PropTypes.shape({
    name: PropTypes.string.isRequired,
    contents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    permissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  }).isRequired,
  setContentGroup: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  convention: PropTypes.shape({
    staff_positions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  permissionsChangeSet: PropTypes.shape({}).isRequired,
  addPermission: PropTypes.func.isRequired,
  removePermission: PropTypes.func.isRequired,
};

CmsContentGroupFormFields.defaultProps = {
  disabled: false,
};

export default CmsContentGroupFormFields;

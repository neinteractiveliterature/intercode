import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'inflected';
import classNames from 'classnames';

function modelEquals(a, b) {
  return (
    a.__typename === b.__typename
    && a.id === b.id
  );
}

function permissionEquals(a, b) {
  return modelEquals(a.model, b.model) && a.permission === b.permission;
}

function findPermission(currentPermissions, model, permission) {
  return currentPermissions.find(currentPermission => (
    permissionEquals(currentPermission, { model, permission })
  ));
}

const PermissionNamePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  permission: PropTypes.string.isRequired,
});

const ModelPropType = PropTypes.shape({
  __typename: PropTypes.string.isRequired,
  id: PropTypes.oneOfType(PropTypes.number, PropTypes.string).isRequired,
});

const PermissionPropType = PropTypes.shape({
  model: ModelPropType.isRequired,
  permission: PermissionNamePropType.isRequired,
});

function PermissionsTableCell({
  initialPermissions,
  currentPermissions,
  changeSet,
  model,
  permission,
  grantPermission,
  revokePermission,
}) {
  const setPermission = (value) => {
    if (value) {
      grantPermission(model, permission);
    } else {
      revokePermission(model, permission);
    }
  };

  const existingPermission = findPermission(
    initialPermissions, model, permission,
  );

  const hasPermission = (
    findPermission(currentPermissions, model, permission) != null
  );

  return (
    <td
      key={permission}
      role="gridcell"
      tabIndex={0}
      className={classNames('cursor-pointer text-center align-middle', {
        'table-success': changeSet.changes.some(({ changeType, value }) => (
          changeType === 'add'
          && permissionEquals(value, { model, permission })
        )),
        'table-danger': (
          existingPermission
          && changeSet.changes.some(({ changeType, id }) => (
            changeType === 'remove'
            && existingPermission.id === id
          ))
        ),
      })}
      onClick={() => {
        setPermission(!hasPermission);
      }}
      onKeyDown={(event) => {
        if (event.keyCode === 32 || event.keyCode === 13) {
          setPermission(!hasPermission);
        }
      }}
    >
      {
        hasPermission
          ? (
            <i className="fa fa-check-square-o">
              <span className="sr-only">Permitted</span>
            </i>
          )
          : (
            <i className="fa fa-square-o">
              <span className="sr-only">Not permitted</span>
            </i>
          )
      }
    </td>
  );
}

PermissionsTableCell.propTypes = {
  model: ModelPropType.isRequired,
  permission: PermissionPropType.isRequired,
  initialPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  currentPermissions: PropTypes.arrayOf(PermissionPropType).isRequired,
  changeSet: PropTypes.shape({}).isRequired,
  grantPermission: PropTypes.func.isRequired,
  revokePermission: PropTypes.func.isRequired,
};

function PermissionsTableInput({
  permissionNames,
  initialPermissions,
  models,
  changeSet,
  add,
  remove,
  modelsHeader,
  formatModelHeader,
}) {
  const currentPermissions = changeSet.apply(initialPermissions);

  const grantPermission = (model, permission) => {
    add(
      { model, permission },
      initialPermissions,
      permissionEquals,
    );
  };

  const revokePermission = (model, permission) => {
    const permissionId = findPermission(currentPermissions, model, permission).id;

    remove(permissionId);
  };

  return (
    <table className="table table-responsive table-hover-cell" role="grid">
      <thead>
        <tr>
          <th>{modelsHeader}</th>
          {
            permissionNames.map(({ permission, name }) => (
              <th key={permission} className="text-center">{titleize(name)}</th>
            ))
          }
        </tr>
      </thead>

      <tbody>
        {models.map(model => (
          <tr key={model.id}>
            <th scope="row">
              {formatModelHeader(model)}
            </th>
            {permissionNames.map(({ permission }) => (
              <PermissionsTableCell
                key={permission.name}
                initialPermissions={initialPermissions}
                currentPermissions={currentPermissions}
                changeSet={changeSet}
                model={model}
                permission={permission}
                grantPermission={grantPermission}
                revokePermission={revokePermission}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

PermissionsTableInput.propTypes = {
  permissionNames: PropTypes.arrayOf(PermissionNamePropType).isRequired,
  initialPermissions: PropTypes.arrayOf(PermissionPropType.isRequired).isRequired,
  models: PropTypes.arrayOf(ModelPropType).isRequired,
  changeSet: PropTypes.shape({}).isRequired,
  add: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  modelsHeader: PropTypes.node,
  formatModelHeader: PropTypes.func.isRequired,
};

PermissionsTableInput.defaultProps = {
  modelsHeader: null,
};

export default PermissionsTableInput;

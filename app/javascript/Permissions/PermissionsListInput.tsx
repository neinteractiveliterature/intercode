import React, { useCallback, useId, useMemo } from 'react';
import capitalize from 'lodash/capitalize';

import usePermissionsChangeSet, { UsePermissionsChangeSetOptions } from './usePermissionsChangeSet';
import usePermissionToggle, { UsePermissionToggleOptions } from './usePermissionToggle';
import { permissionEquals, PolymorphicPermission } from './PermissionUtils';

type PermissionsListRowProps = UsePermissionToggleOptions & {
  name: string;
};

function PermissionsListRow({
  grantPermission,
  revokePermission,
  model,
  role,
  permission,
  name,
  initialPermissions,
  changeSet,
  currentPermissions,
  readOnly,
}: PermissionsListRowProps) {
  const { toggle, hasPermission, className, granted, revoked } = usePermissionToggle({
    grantPermission,
    revokePermission,
    model,
    role,
    permission,
    initialPermissions,
    changeSet,
    currentPermissions,
    readOnly,
  });
  const checkboxId = useId();

  return (
    <tr className={className}>
      <th scope="row" className="text-start fw-normal pe-4">
        <label className="form-label" htmlFor={checkboxId}>
          {capitalize(name)}
        </label>
      </th>
      <td>
        <div className="d-flex justify-content-end">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id={checkboxId}
              checked={hasPermission}
              aria-label="Permitted"
              onChange={toggle}
            />
          </div>
        </div>
      </td>
      <td>
        {granted && (
          <>
            <i className="bi-plus-square" />
            <span className="visually-hidden">Permission added</span>
          </>
        )}
        {revoked && (
          <>
            <i className="bi-dash-square" />
            <span className="visually-hidden">Permission removed</span>
          </>
        )}
      </td>
    </tr>
  );
}

export type PermissionsListInputProps = UsePermissionsChangeSetOptions & {
  model: PolymorphicPermission['model'];
  role: PolymorphicPermission['role'];
  permissionNames: { permission: string; name: string }[];
  reset: () => void;
  header?: React.ReactNode;
  readOnly?: boolean;
};

function PermissionsListInput({
  permissionNames,
  initialPermissions,
  model,
  role,
  changeSet,
  add,
  remove,
  reset,
  header,
  readOnly,
}: PermissionsListInputProps): React.JSX.Element {
  const { currentPermissions, grantPermission, revokePermission } = usePermissionsChangeSet({
    initialPermissions,
    changeSet,
    add,
    remove,
  });

  const setAllPermitted = useCallback(
    (permitted: boolean) => {
      permissionNames.forEach(({ permission }) => {
        if (permitted) {
          grantPermission({ permission, model, role });
        } else {
          revokePermission({ permission, model, role });
        }
      });
    },
    [permissionNames, grantPermission, revokePermission, model, role],
  );

  const allPermitted = useMemo(
    () =>
      permissionNames.every(({ permission }) =>
        currentPermissions.some((currentPermission) =>
          permissionEquals(currentPermission, { permission, model, role }),
        ),
      ),
    [permissionNames, currentPermissions, model, role],
  );

  const nonePermitted = useMemo(
    () =>
      !permissionNames.some(({ permission }) =>
        currentPermissions.some((currentPermission) =>
          permissionEquals(currentPermission, { permission, model, role }),
        ),
      ),
    [permissionNames, currentPermissions, model, role],
  );

  return (
    <table className="table table-hover table-sm table-striped w-auto" role="grid">
      <thead>
        <tr>
          <th>{header}</th>
          <td colSpan={2}>
            <button
              className="btn btn-sm btn-outline-success"
              type="button"
              disabled={allPermitted}
              onClick={() => setAllPermitted(true)}
            >
              <i className="bi-hand-thumbs-up-fill" /> Grant all
            </button>{' '}
            <button
              className="btn btn-sm btn-outline-danger"
              type="button"
              disabled={nonePermitted}
              onClick={() => setAllPermitted(false)}
            >
              <i className="bi-hand-thumbs-down-fill" /> Revoke all
            </button>{' '}
            <button
              className="btn btn-sm btn-outline-info"
              type="button"
              disabled={changeSet?.changes.length === 0}
              onClick={reset}
            >
              <i className="bi-arrow-repeat" /> Reset
            </button>
          </td>
        </tr>
      </thead>

      <tbody>
        {permissionNames.map(({ permission, name }) => (
          <PermissionsListRow
            key={permission}
            initialPermissions={initialPermissions}
            currentPermissions={currentPermissions}
            changeSet={changeSet}
            model={model}
            role={role}
            permission={permission}
            name={name}
            grantPermission={grantPermission}
            revokePermission={revokePermission}
            readOnly={readOnly ?? false}
          />
        ))}
      </tbody>
    </table>
  );
}

export default PermissionsListInput;

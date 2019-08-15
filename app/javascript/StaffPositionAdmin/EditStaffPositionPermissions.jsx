import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import flatMap from 'lodash-es/flatMap';
import { useMutation } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import PermissionNames from '../../../config/permission_names.json';
import { UpdateStaffPositionPermissions } from './mutations.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import PermissionsTableInput from '../BuiltInFormControls/PermissionsTableInput';
import { useChangeSet } from '../ChangeSet';
import usePageTitle from '../usePageTitle';

function buildPermissionInput(permission) {
  return {
    model_type: permission.model.__typename,
    model_id: permission.model.id,
    permission: permission.permission,
  };
}

function getPermissionNamesForModelType(modelType) {
  return flatMap(
    PermissionNames.filter(
      permissionNameGroup => permissionNameGroup.model_type === modelType,
    ),
    permissionNameGroup => permissionNameGroup.permissions,
  );
}

const EventCategoryPermissionNames = getPermissionNamesForModelType('EventCategory');
const ConventionPermissionNames = getPermissionNamesForModelType('Convention');

function EditStaffPositionPermissions({
  staffPosition, convention, eventCategories, history,
}) {
  const [changeSet, add, remove] = useChangeSet();
  const [error, setError] = useState(null);
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const [mutate] = useMutation(UpdateStaffPositionPermissions);

  usePageTitle(`Editing permissions for “${staffPosition.name}”`);

  const saveChangesClicked = async () => {
    setMutationInProgress(true);
    try {
      await mutate({
        variables: {
          staffPositionId: staffPosition.id,
          grantPermissions: changeSet.getAddValues()
            .map(buildPermissionInput),
          revokePermissions: changeSet.getRemoveIds().map((removeId) => {
            const existingPermission = staffPosition.permissions
              .find(p => p.id === removeId);

            return buildPermissionInput(existingPermission);
          }),
        },
      });

      history.push('/staff_positions');
    } catch (newError) {
      setError(newError);
      setMutationInProgress(false);
    }
  };

  return (
    <>
      <h1 className="mb-4">
        {staffPosition.name}
        {' Permissions'}
      </h1>

      <section className="mb-4">
        <PermissionsTableInput
          permissionNames={ConventionPermissionNames}
          initialPermissions={staffPosition.permissions}
          models={[convention]}
          changeSet={changeSet}
          add={add}
          remove={remove}
          modelsHeader="Convention"
          formatModelHeader={con => con.name}
        />
      </section>

      <section className="mb-4">
        <PermissionsTableInput
          permissionNames={EventCategoryPermissionNames}
          initialPermissions={staffPosition.permissions}
          models={eventCategories}
          changeSet={changeSet}
          add={add}
          remove={remove}
          modelsHeader="Event Category"
          formatModelHeader={eventCategory => (
            <span
              className="p-1 rounded"
              style={getEventCategoryStyles({ eventCategory, variant: 'default' })}
            >
              {eventCategory.name}
            </span>
          )}
        />
      </section>

      <ErrorDisplay graphQLError={error} />

      <button
        className="mt-4 btn btn-primary"
        type="button"
        onClick={saveChangesClicked}
        disabled={mutationInProgress}
      >
        Save changes
      </button>
    </>
  );
}

EditStaffPositionPermissions.propTypes = {
  staffPosition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.shape({
      model: PropTypes.shape({
        __typename: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
      }).isRequired,
      permission: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  eventCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EditStaffPositionPermissions);

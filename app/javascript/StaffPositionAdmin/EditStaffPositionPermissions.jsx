import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { flatMap } from 'lodash';
import { useMutation } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import PermissionNames from '../../../config/permission_names.json';
import { UpdateStaffPositionPermissions } from './mutations.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import PermissionsTableInput from '../BuiltInFormControls/PermissionsTableInput';
import { useChangeSet } from '../ChangeSet';

function buildPermissionInput(permission) {
  return {
    model_type: permission.model.__typename,
    model_id: permission.model.id,
    permission: permission.permission,
  };
}

const EventCategoryPermissionNames = flatMap(
  PermissionNames.filter(
    permissionNameGroup => permissionNameGroup.model_type === 'EventCategory',
  ),
  permissionNameGroup => permissionNameGroup.permissions,
);

function EditStaffPositionPermissions({ staffPosition, eventCategories, history }) {
  const [changeSet, add, remove] = useChangeSet();
  const [error, setError] = useState(null);
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const mutate = useMutation(UpdateStaffPositionPermissions);

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

      history.push('/');
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EditStaffPositionPermissions);

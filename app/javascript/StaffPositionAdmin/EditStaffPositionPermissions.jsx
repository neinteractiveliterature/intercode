import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { UpdateStaffPositionPermissions } from './mutations.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import PermissionsListInput from '../Permissions/PermissionsListInput';
import PermissionsTableInput from '../Permissions/PermissionsTableInput';
import { useChangeSet } from '../ChangeSet';
import usePageTitle from '../usePageTitle';
import { getPermissionNamesForModelType, buildPermissionInput } from '../Permissions/PermissionUtils';

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
              .find((p) => p.id === removeId);

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
        <PermissionsListInput
          permissionNames={ConventionPermissionNames}
          initialPermissions={staffPosition.permissions}
          model={convention}
          changeSet={changeSet}
          add={add}
          remove={remove}
          header={convention.name}
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
          formatModelHeader={(eventCategory) => (
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

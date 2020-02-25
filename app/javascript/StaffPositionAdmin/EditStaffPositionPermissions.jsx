import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import { UpdateStaffPositionPermissions } from './mutations.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import PermissionsListInput from '../Permissions/PermissionsListInput';
import PermissionsTableInput from '../Permissions/PermissionsTableInput';
import { useChangeSet } from '../ChangeSet';
import usePageTitle from '../usePageTitle';
import { getPermissionNamesForModelType, buildPermissionInput } from '../Permissions/PermissionUtils';
import { useTabs, TabList, TabBody } from '../UIComponents/Tabs';

const CmsContentGroupPermissionNames = getPermissionNamesForModelType('CmsContentGroup');
const EventCategoryPermissionNames = getPermissionNamesForModelType('EventCategory');
const ConventionPermissionNames = getPermissionNamesForModelType('Convention');

function EditStaffPositionPermissions({ staffPosition, convention }) {
  const history = useHistory();
  const [changeSet, add, remove] = useChangeSet();
  const [error, setError] = useState(null);
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const [mutate] = useMutation(UpdateStaffPositionPermissions);
  const tabProps = useTabs([
    {
      id: 'convention',
      name: 'Convention',
      renderContent: () => (
        <PermissionsListInput
          permissionNames={ConventionPermissionNames}
          initialPermissions={staffPosition.permissions}
          model={convention}
          changeSet={changeSet}
          add={add}
          remove={remove}
          header={convention.name}
        />
      ),
    },
    {
      id: 'eventCategories',
      name: 'Event categories',
      renderContent: () => (
        <PermissionsTableInput
          permissionNames={EventCategoryPermissionNames}
          initialPermissions={staffPosition.permissions}
          rowType="model"
          models={convention.event_categories}
          changeSet={changeSet}
          add={add}
          remove={remove}
          rowsHeader="Event Category"
          formatRowHeader={(eventCategory) => (
            <span
              className="p-1 rounded"
              style={getEventCategoryStyles({ eventCategory, variant: 'default' })}
            >
              {eventCategory.name}
            </span>
          )}
        />
      ),
    },
    {
      id: 'cmsContentGroups',
      name: 'CMS Content Groups',
      renderContent: () => (
        <PermissionsTableInput
          permissionNames={CmsContentGroupPermissionNames}
          initialPermissions={staffPosition.permissions}
          rowType="model"
          models={convention.cms_content_groups}
          changeSet={changeSet}
          add={add}
          remove={remove}
          rowsHeader="CMS Content Group"
          formatRowHeader={(contentGroup) => contentGroup.name}
        />
      ),
    },
  ]);

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

      <TabList {...tabProps} />
      <section className="mt-2">
        <TabBody {...tabProps} />
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
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
    event_categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    cms_content_groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default EditStaffPositionPermissions;

import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {
  useTabs,
  TabList,
  TabBody,
  notEmpty,
  ErrorDisplay,
} from '@neinteractiveliterature/litform';

import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import PermissionsListInput from '../Permissions/PermissionsListInput';
import PermissionsTableInput from '../Permissions/PermissionsTableInput';
import { useChangeSet } from '../ChangeSet';
import usePageTitle from '../usePageTitle';
import {
  getPermissionNamesForModelType,
  buildPermissionInput,
} from '../Permissions/PermissionUtils';
import { PermissionedModelTypeIndicator } from '../graphqlTypes.generated';
import { useStaffPositionsQuery } from './queries.generated';
import { PermissionWithId } from '../Permissions/usePermissionsChangeSet';
import { useUpdateStaffPositionPermissionsMutation } from './mutations.generated';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';

const CmsContentGroupPermissionNames = getPermissionNamesForModelType(
  PermissionedModelTypeIndicator.CmsContentGroup,
);
const EventCategoryPermissionNames = getPermissionNamesForModelType(
  PermissionedModelTypeIndicator.EventCategory,
);
const ConventionPermissionNames = getPermissionNamesForModelType(
  PermissionedModelTypeIndicator.Convention,
);

export default LoadSingleValueFromCollectionWrapper(
  useStaffPositionsQuery,
  (data, id) => data.convention.staff_positions.find((sp) => sp.id.toString(10) === id),
  function EditStaffPositionPermissions({ value: staffPosition, data: { convention } }) {
    const history = useHistory();
    const [changeSet, add, remove] = useChangeSet<PermissionWithId>();
    const [error, setError] = useState<ApolloError>();
    const [mutationInProgress, setMutationInProgress] = useState(false);
    const [mutate] = useUpdateStaffPositionPermissionsMutation();
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
            rows={convention.event_categories}
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
            rows={convention.cmsContentGroups}
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
            grantPermissions: changeSet.getAddValues().map(buildPermissionInput),
            revokePermissions: changeSet
              .getRemoveIds()
              .map((removeId) => {
                const existingPermission = staffPosition.permissions.find((p) => p.id === removeId);

                return existingPermission ? buildPermissionInput(existingPermission) : undefined;
              })
              .filter(notEmpty),
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
  },
);

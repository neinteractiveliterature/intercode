import { ApolloError } from '@apollo/client';
import { ActionFunction, LoaderFunction, redirect, useFetcher, useLoaderData } from 'react-router';
import { useTabs, TabList, TabBody, notEmpty, ErrorDisplay } from '@neinteractiveliterature/litform';

import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import PermissionsListInput from '../Permissions/PermissionsListInput';
import PermissionsTableInput from '../Permissions/PermissionsTableInput';
import ChangeSet, { useChangeSet } from '../ChangeSet';
import usePageTitle from '../usePageTitle';
import { getPermissionNamesForModelType, buildPermissionInput } from '../Permissions/PermissionUtils';
import { PermissionedModelTypeIndicator } from '../graphqlTypes.generated';
import { StaffPositionsQueryData, StaffPositionsQueryDocument } from './queries.generated';
import { PermissionWithId } from '../Permissions/usePermissionsChangeSet';
import { client } from '../useIntercodeApolloClient';
import {
  UpdateStaffPositionPermissionsDocument,
  UpdateStaffPositionPermissionsMutationVariables,
} from './mutations.generated';

type ActionInput = Omit<UpdateStaffPositionPermissionsMutationVariables, 'staffPositionId'>;

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    const { grantPermissions, revokePermissions } = (await request.json()) as ActionInput;
    await client.mutate({
      mutation: UpdateStaffPositionPermissionsDocument,
      variables: { staffPositionId: id, grantPermissions, revokePermissions },
    });
    return redirect('/staff_positions');
  } catch (error) {
    return error;
  }
};

const CmsContentGroupPermissionNames = getPermissionNamesForModelType(PermissionedModelTypeIndicator.CmsContentGroup);
const EventCategoryPermissionNames = getPermissionNamesForModelType(PermissionedModelTypeIndicator.EventCategory);
const ConventionPermissionNames = getPermissionNamesForModelType(PermissionedModelTypeIndicator.Convention);

type LoaderResult = {
  convention: StaffPositionsQueryData['convention'];
  staffPosition: StaffPositionsQueryData['convention']['staff_positions'][number];
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<StaffPositionsQueryData>({ query: StaffPositionsQueryDocument });
  const staffPosition = data.convention.staff_positions.find((staffPosition) => staffPosition.id === id);
  if (!staffPosition) {
    return new Response(null, { status: 404 });
  }

  return { convention: data.convention, staffPosition } satisfies LoaderResult;
};

function EditStaffPositionPermissions() {
  const { convention, staffPosition } = useLoaderData() as LoaderResult;
  const [conventionChangeSet, conventionAdd, conventionRemove, conventionReset] = useChangeSet<PermissionWithId>();
  const [eventCategoriesChangeSet, eventCategoriesAdd, eventCategoriesRemove] = useChangeSet<PermissionWithId>();
  const [contentGroupsChangeSet, contentGroupsAdd, contentGroupsRemove] = useChangeSet<PermissionWithId>();

  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const mutationInProgress = fetcher.state !== 'idle';

  const tabProps = useTabs([
    {
      id: 'convention',
      name: 'Convention',
      renderContent: () => (
        <PermissionsListInput
          permissionNames={ConventionPermissionNames}
          initialPermissions={staffPosition.permissions}
          role={staffPosition}
          model={convention}
          changeSet={conventionChangeSet}
          add={conventionAdd}
          remove={conventionRemove}
          reset={conventionReset}
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
          role={staffPosition}
          rows={convention.event_categories}
          changeSet={eventCategoriesChangeSet}
          add={eventCategoriesAdd}
          remove={eventCategoriesRemove}
          rowsHeader="Event Category"
          formatRowHeader={(eventCategory) => (
            <span className="p-1 rounded" style={getEventCategoryStyles({ eventCategory, variant: 'default' })}>
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
          role={staffPosition}
          rows={convention.cmsContentGroups}
          changeSet={contentGroupsChangeSet}
          add={contentGroupsAdd}
          remove={contentGroupsRemove}
          rowsHeader="CMS Content Group"
          formatRowHeader={(contentGroup) => contentGroup.name}
        />
      ),
    },
  ]);

  usePageTitle(`Editing permissions for “${staffPosition.name}”`);

  const saveChangesClicked = async () => {
    const combinedChangeSet = new ChangeSet([
      ...conventionChangeSet.changes,
      ...eventCategoriesChangeSet.changes,
      ...contentGroupsChangeSet.changes,
    ]);
    const variables: ActionInput = {
      grantPermissions: combinedChangeSet.getAddValues().map(buildPermissionInput),
      revokePermissions: combinedChangeSet
        .getRemoveIds()
        .map((removeId) => {
          const existingPermission = staffPosition.permissions.find((p) => p.id === removeId);

          return existingPermission ? buildPermissionInput(existingPermission) : undefined;
        })
        .filter(notEmpty),
    };
    fetcher.submit(variables, { encType: 'application/json', method: 'PATCH' });
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

      <ErrorDisplay graphQLError={error as ApolloError} />

      <button className="mt-4 btn btn-primary" type="button" onClick={saveChangesClicked} disabled={mutationInProgress}>
        Save changes
      </button>
    </>
  );
}

export default EditStaffPositionPermissions;

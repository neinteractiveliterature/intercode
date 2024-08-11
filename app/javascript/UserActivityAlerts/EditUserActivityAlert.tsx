import { useState, useMemo } from 'react';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { useConfirm, ErrorDisplay, useDeleteMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import UserActivityAlertForm from './UserActivityAlertForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryDocument } from './queries.generated';
import { useDeleteUserActivityAlertMutation, useUpdateUserActivityAlertMutation } from './mutations.generated';
import { client } from '../useIntercodeApolloClient';

type LoaderResult = {
  convention: UserActivityAlertsAdminQueryData['convention'];
  initialUserActivityAlert: UserActivityAlertsAdminQueryData['convention']['user_activity_alerts'][number];
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<UserActivityAlertsAdminQueryData>({
    query: UserActivityAlertsAdminQueryDocument,
  });

  const initialUserActivityAlert = data.convention.user_activity_alerts.find((alert) => alert.id === id);
  if (!initialUserActivityAlert) {
    return new Response(null, { status: 404 });
  }
  return { convention: data.convention, initialUserActivityAlert } as LoaderResult;
};

function EditUserActivityAlertForm() {
  const { initialUserActivityAlert, convention } = useLoaderData() as LoaderResult;

  usePageTitle('Editing user activity alert');
  const navigate = useNavigate();
  const [userActivityAlert, setUserActivityAlert] = useState(initialUserActivityAlert);
  const [notificationDestinationChangeSet, addNotificationDestination, removeNotificationDestination] =
    useChangeSet<(typeof userActivityAlert)['notification_destinations'][0]>();
  const [updateMutate] = useUpdateUserActivityAlertMutation();
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const [deleteAlert] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteUserActivityAlertMutation,
    convention,
    'user_activity_alerts',
    (alert) => ({ id: alert.id }),
  );
  const combinedUserActivityAlert = useMemo(
    () => ({
      ...userActivityAlert,
      notification_destinations: notificationDestinationChangeSet.apply(userActivityAlert.notification_destinations),
    }),
    [notificationDestinationChangeSet, userActivityAlert],
  );
  const confirm = useConfirm();

  const saveClicked = async () => {
    await update({
      variables: {
        id: userActivityAlert.id,
        userActivityAlert: buildUserActivityAlertInput(userActivityAlert),
        addNotificationDestinations: notificationDestinationChangeSet.getAddValues().map((addValue) => {
          if (addValue.staff_position) {
            return { staffPositionId: addValue.staff_position.id };
          }
          if (addValue.user_con_profile) {
            return { userConProfileId: addValue.user_con_profile.id };
          }
          throw new Error('Notification destination must have either a staff position or user con profile');
        }),
        removeNotificationDestinationIds: notificationDestinationChangeSet.getRemoveIds(),
      },
    });

    navigate('/user_activity_alerts');
  };

  const deleteClicked = async () => {
    await deleteAlert(userActivityAlert);
    navigate('/user_activity_alerts');
  };

  return (
    <>
      <div className="d-flex align-items-start mb-4">
        <h1 className="flex-grow-1">Edit user activity alert</h1>
        <button
          className="btn btn-danger"
          type="button"
          onClick={() => {
            confirm({
              action: deleteClicked,
              prompt: 'Are you sure you want to delete this alert?',
            });
          }}
        >
          <i className="bi-trash" /> Delete
        </button>
      </div>
      <UserActivityAlertForm
        userActivityAlert={combinedUserActivityAlert}
        convention={convention}
        onChange={setUserActivityAlert}
        onAddNotificationDestination={addNotificationDestination}
        onRemoveNotificationDestination={removeNotificationDestination}
        disabled={updateInProgress}
      />
      <ErrorDisplay graphQLError={updateError as ApolloError} />
      <button className="btn btn-primary mt-4" type="button" onClick={saveClicked} disabled={updateInProgress}>
        Save changes
      </button>
    </>
  );
}

export const Component = EditUserActivityAlertForm;

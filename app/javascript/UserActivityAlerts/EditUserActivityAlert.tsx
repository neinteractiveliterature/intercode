import { useState, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { LoadQueryWrapper, useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import { DeleteUserActivityAlert } from './mutations';
import { UserActivityAlertsAdminQuery } from './queries';
import UserActivityAlertForm from './UserActivityAlertForm';
import useAsyncFunction from '../useAsyncFunction';
import { useDeleteMutation } from '../MutationUtils';
import usePageTitle from '../usePageTitle';
import { useUserActivityAlertQuery } from './queries.generated';
import { useUpdateUserActivityAlertMutation } from './mutations.generated';

function useLoadUserActivityAlert() {
  const userActivityAlertId = Number.parseInt(useParams<{ id: string }>().id, 10);
  return useUserActivityAlertQuery({ variables: { id: userActivityAlertId } });
}

export default LoadQueryWrapper(
  useLoadUserActivityAlert,
  function EditUserActivityAlertForm({ data }) {
    usePageTitle('Editing user activity alert');
    const history = useHistory();
    const [userActivityAlert, setUserActivityAlert] = useState(data.convention.user_activity_alert);
    const [
      notificationDestinationChangeSet,
      addNotificationDestination,
      removeNotificationDestination,
    ] = useChangeSet<typeof userActivityAlert['notification_destinations'][0]>();
    const [updateMutate] = useUpdateUserActivityAlertMutation();
    const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);
    const deleteMutate = useDeleteMutation(DeleteUserActivityAlert, {
      query: UserActivityAlertsAdminQuery,
      arrayPath: ['convention', 'user_activity_alerts'],
      idVariablePath: ['id'],
    });
    const combinedUserActivityAlert = useMemo(
      () => ({
        ...userActivityAlert,
        notification_destinations: notificationDestinationChangeSet.apply(
          userActivityAlert.notification_destinations,
        ),
      }),
      [notificationDestinationChangeSet, userActivityAlert],
    );
    const confirm = useConfirm();

    const saveClicked = async () => {
      await update({
        variables: {
          id: userActivityAlert.id,
          userActivityAlert: buildUserActivityAlertInput(userActivityAlert),
          addNotificationDestinations: notificationDestinationChangeSet
            .getAddValues()
            .map((addValue) => {
              if (addValue.staff_position) {
                return { staff_position_id: addValue.staff_position.id };
              }
              return { user_con_profile_id: addValue.user_con_profile!.id };
            }),
          removeNotificationDestinationIds: notificationDestinationChangeSet.getRemoveIds(),
        },
      });

      history.push('/user_activity_alerts');
    };

    const deleteClicked = async () => {
      await deleteMutate({ variables: { id: userActivityAlert.id } });
      history.push('/');
    };

    return (
      <>
        .{' '}
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
            <i className="fa fa-trash-o" /> Delete
          </button>
        </div>
        <UserActivityAlertForm
          userActivityAlert={combinedUserActivityAlert}
          convention={data.convention}
          onChange={setUserActivityAlert}
          onAddNotificationDestination={addNotificationDestination}
          onRemoveNotificationDestination={removeNotificationDestination}
          disabled={updateInProgress}
        />
        <ErrorDisplay graphQLError={updateError as ApolloError} />
        <button
          className="btn btn-primary mt-4"
          type="button"
          onClick={saveClicked}
          disabled={updateInProgress}
        >
          Save changes
        </button>
      </>
    );
  },
);

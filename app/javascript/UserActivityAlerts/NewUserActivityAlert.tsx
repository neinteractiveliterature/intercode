import { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { LoadQueryWrapper, ErrorDisplay } from '@neinteractiveliterature/litform';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import { CreateUserActivityAlert } from './mutations';
import { UserActivityAlertsAdminQuery } from './queries';
import UserActivityAlertForm from './UserActivityAlertForm';
import { useCreateMutation } from '../MutationUtils';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { useConventionTicketNameQuery, UserActivityAlertQueryData } from './queries.generated';

export default LoadQueryWrapper(
  useConventionTicketNameQuery,
  function NewUserActivityAlert({ data }) {
    const history = useHistory();
    usePageTitle('New user activity alert');

    const [userActivityAlert, setUserActivityAlert] = useState<
      UserActivityAlertQueryData['convention']['user_activity_alert']
    >({
      __typename: 'UserActivityAlert',
      id: 0,
      email: null,
      partial_name: null,
      user: null,
      trigger_on_ticket_create: true,
      trigger_on_user_con_profile_create: true,
      notification_destinations: [],
    });
    const [
      notificationDestinationChangeSet,
      addNotificationDestination,
      removeNotificationDestination,
    ] = useChangeSet<
      UserActivityAlertQueryData['convention']['user_activity_alert']['notification_destinations'][number]
    >();
    const [create, createError, createInProgress] = useAsyncFunction(
      useCreateMutation(CreateUserActivityAlert, {
        query: UserActivityAlertsAdminQuery,
        arrayPath: ['convention', 'user_activity_alerts'],
        newObjectPath: ['createUserActivityAlert', 'user_activity_alert'],
      }),
    );
    const combinedUserActivityAlert = useMemo(
      () => ({
        ...userActivityAlert,
        notification_destinations: notificationDestinationChangeSet.apply(
          userActivityAlert.notification_destinations,
        ),
      }),
      [notificationDestinationChangeSet, userActivityAlert],
    );

    const saveClicked = async () => {
      await create({
        variables: {
          userActivityAlert: buildUserActivityAlertInput(userActivityAlert),
          notificationDestinations: notificationDestinationChangeSet
            .getAddValues()
            .map((addValue) => {
              if (addValue.staff_position) {
                return { staff_position_id: addValue.staff_position.id };
              }
              return { user_con_profile_id: addValue.user_con_profile!.id };
            }),
        },
      });

      history.push('/user_activity_alerts');
    };

    return (
      <>
        <h1 className="mb-4">New user activity alert</h1>

        <UserActivityAlertForm
          userActivityAlert={combinedUserActivityAlert}
          convention={data.convention}
          onChange={setUserActivityAlert}
          onAddNotificationDestination={addNotificationDestination}
          onRemoveNotificationDestination={removeNotificationDestination}
          disabled={createInProgress}
        />

        <ErrorDisplay graphQLError={createError as ApolloError} />

        <button
          className="btn btn-primary mt-4"
          type="button"
          onClick={saveClicked}
          disabled={createInProgress}
        >
          Create user activity alert
        </button>
      </>
    );
  },
);

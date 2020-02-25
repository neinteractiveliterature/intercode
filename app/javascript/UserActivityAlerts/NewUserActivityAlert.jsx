import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import { CreateUserActivityAlert } from './mutations.gql';
import { ConventionTicketNameQuery, UserActivityAlertsAdminQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import UserActivityAlertForm from './UserActivityAlertForm';
import { useCreateMutation } from '../MutationUtils';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function NewUserActivityAlert() {
  const history = useHistory();
  usePageTitle('New user activity alert');
  const { data, loading, error } = useQuery(ConventionTicketNameQuery);

  const [userActivityAlert, setUserActivityAlert] = useState({
    email: null,
    partial_name: null,
    user: null,
    trigger_on_ticket_create: true,
    trigger_on_user_con_profile_create: true,
    notification_destinations: [],
  });
  const [
    notificationDestinationChangeSet, addNotificationDestination, removeNotificationDestination,
  ] = useChangeSet();
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
      notification_destinations: notificationDestinationChangeSet
        .apply(userActivityAlert.notification_destinations),
    }),
    [notificationDestinationChangeSet, userActivityAlert],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention } = data;

  const saveClicked = async () => {
    await create({
      variables: {
        userActivityAlert: buildUserActivityAlertInput(userActivityAlert),
        notificationDestinations: notificationDestinationChangeSet.getAddValues()
          .map((addValue) => {
            if (addValue.staff_position) {
              return { staff_position_id: addValue.staff_position.id };
            }
            return { user_con_profile_id: addValue.user_con_profile.id };
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
        convention={convention}
        onChange={setUserActivityAlert}
        onAddNotificationDestination={addNotificationDestination}
        onRemoveNotificationDestination={removeNotificationDestination}
        disabled={createInProgress}
      />

      <ErrorDisplay graphQLError={createError} />

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
}

export default NewUserActivityAlert;

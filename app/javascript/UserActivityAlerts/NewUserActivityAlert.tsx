import { useState, useMemo } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import UserActivityAlertForm from './UserActivityAlertForm';
import usePageTitle from '../usePageTitle';
import { UserActivityAlertFieldsFragmentDoc, UserActivityAlertsAdminQueryData } from './queries.generated';
import { useCreateUserActivityAlertMutation } from './mutations.generated';
import { NamedRoute } from '../AppRouter';

function NewUserActivityAlert() {
  const data = useRouteLoaderData(NamedRoute.UserActivityAlerts) as UserActivityAlertsAdminQueryData;
  const navigate = useNavigate();
  usePageTitle('New user activity alert');

  const [userActivityAlert, setUserActivityAlert] = useState<
    UserActivityAlertsAdminQueryData['convention']['user_activity_alerts'][number]
  >({
    __typename: 'UserActivityAlert',
    id: '',
    email: null,
    partial_name: null,
    user: null,
    trigger_on_ticket_create: true,
    trigger_on_user_con_profile_create: true,
    notification_destinations: [],
  });
  const [notificationDestinationChangeSet, addNotificationDestination, removeNotificationDestination] =
    useChangeSet<
      UserActivityAlertsAdminQueryData['convention']['user_activity_alerts'][number]['notification_destinations'][number]
    >();
  const [create, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateUserActivityAlertMutation,
    data.convention,
    'user_activity_alerts',
    (data) => data.createUserActivityAlert.user_activity_alert,
    UserActivityAlertFieldsFragmentDoc,
  );
  const combinedUserActivityAlert = useMemo(
    () => ({
      ...userActivityAlert,
      notification_destinations: notificationDestinationChangeSet.apply(userActivityAlert.notification_destinations),
    }),
    [notificationDestinationChangeSet, userActivityAlert],
  );

  const saveClicked = async () => {
    await create({
      variables: {
        userActivityAlert: buildUserActivityAlertInput(userActivityAlert),
        notificationDestinations: notificationDestinationChangeSet.getAddValues().map((addValue) => {
          if (addValue.staff_position) {
            return { staffPositionId: addValue.staff_position.id };
          }
          if (addValue.user_con_profile) {
            return { userConProfileId: addValue.user_con_profile.id };
          }
          throw new Error('Notification destination must have either a staff position or user con profile');
        }),
      },
    });

    navigate('/user_activity_alerts');
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

      <button className="btn btn-primary mt-4" type="button" onClick={saveClicked} disabled={createInProgress}>
        Create user activity alert
      </button>
    </>
  );
}

export const Component = NewUserActivityAlert;

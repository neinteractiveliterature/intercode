import { useState, useMemo } from 'react';
import { ActionFunction, LoaderFunction, redirect, useFetcher, useLoaderData } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import UserActivityAlertForm from './UserActivityAlertForm';
import usePageTitle from '../usePageTitle';
import {
  UserActivityAlertFieldsFragmentDoc,
  UserActivityAlertsAdminQueryData,
  UserActivityAlertsAdminQueryDocument,
} from './queries.generated';
import { CreateUserActivityAlertDocument, CreateUserActivityAlertMutationVariables } from './mutations.generated';
import { client } from 'useIntercodeApolloClient';
import { Convention, NotificationEventKey } from 'graphqlTypes.generated';

type LoaderResult = {
  convention: UserActivityAlertsAdminQueryData['convention'];
  userActivityAlertEvent: UserActivityAlertsAdminQueryData['notificationEvents'][number];
};

export const loader: LoaderFunction = async () => {
  const { data } = await client.query({ query: UserActivityAlertsAdminQueryDocument });

  const userActivityAlertEvent = data.notificationEvents.find(
    (event) => event.key === NotificationEventKey.UserActivityAlertsAlert,
  );
  if (!userActivityAlertEvent) {
    return new Response(null, { status: 404 });
  }

  return { userActivityAlertEvent, convention: data.convention } satisfies LoaderResult;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === 'POST') {
      const variables = (await request.json()) as CreateUserActivityAlertMutationVariables;
      await client.mutate({
        mutation: CreateUserActivityAlertDocument,
        variables,
        update: (cache, result) => {
          const userActivityAlert = result.data?.createUserActivityAlert.user_activity_alert;
          if (userActivityAlert) {
            const ref = cache.writeFragment({
              fragment: UserActivityAlertFieldsFragmentDoc,
              data: userActivityAlert,
            });
            cache.modify<Convention>({
              id: cache.identify({ __typename: 'Convention', id: userActivityAlert.convention.id }),
              fields: {
                user_activity_alerts: (value) => [...value, ref],
              },
            });
          }
        },
      });
      return redirect('/user_activity_alerts');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

function NewUserActivityAlert() {
  const { userActivityAlertEvent, convention } = useLoaderData() as LoaderResult;
  // const data = useRouteLoaderData(NamedRoute.UserActivityAlerts) as UserActivityAlertsAdminQueryData;
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
  const fetcher = useFetcher();
  const createError = fetcher.data instanceof Error ? fetcher.data : undefined;
  const createInProgress = fetcher.state !== 'idle';
  const combinedUserActivityAlert = useMemo(
    () => ({
      ...userActivityAlert,
      notification_destinations: notificationDestinationChangeSet.apply(userActivityAlert.notification_destinations),
    }),
    [notificationDestinationChangeSet, userActivityAlert],
  );

  const saveClicked = () => {
    const variables: CreateUserActivityAlertMutationVariables = {
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
    };
    fetcher.submit(variables, { method: 'POST', encType: 'application/json' });
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
        userActivityAlertEvent={userActivityAlertEvent}
      />

      <ErrorDisplay graphQLError={createError as ApolloError} />

      <button className="btn btn-primary mt-4" type="button" onClick={saveClicked} disabled={createInProgress}>
        Create user activity alert
      </button>
    </>
  );
}

export const Component = NewUserActivityAlert;

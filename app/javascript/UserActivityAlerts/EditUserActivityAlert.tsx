import { useState, useMemo } from 'react';
import { ActionFunction, LoaderFunction, redirect, replace, useFetcher, useLoaderData } from 'react-router';
import { ApolloError } from '@apollo/client';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import UserActivityAlertForm from './UserActivityAlertForm';
import usePageTitle from '../usePageTitle';
import { UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryDocument } from './queries.generated';
import {
  DeleteUserActivityAlertDocument,
  UpdateUserActivityAlertDocument,
  UpdateUserActivityAlertMutationVariables,
} from './mutations.generated';
import { client } from '../useIntercodeApolloClient';
import invariant from 'tiny-invariant';
import { NotificationEventKey, UserActivityAlert } from 'graphqlTypes.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  invariant(id != null);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteUserActivityAlertDocument,
        variables: { id },
        update: (cache) => {
          cache.modify<UserActivityAlert>({
            id: cache.identify({ __typename: 'UserActivityAlert', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return replace('/user_activity_alerts');
    } else if (request.method === 'PATCH') {
      const variables = (await request.json()) as Omit<UpdateUserActivityAlertMutationVariables, 'id'>;
      await client.mutate({
        mutation: UpdateUserActivityAlertDocument,
        variables: { id, ...variables },
      });
      return redirect('/user_activity_alerts');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

type LoaderResult = {
  convention: UserActivityAlertsAdminQueryData['convention'];
  initialUserActivityAlert: UserActivityAlertsAdminQueryData['convention']['user_activity_alerts'][number];
  userActivityAlertEvent: UserActivityAlertsAdminQueryData['notificationEvents'][number];
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query({ query: UserActivityAlertsAdminQueryDocument });

  const initialUserActivityAlert = data.convention.user_activity_alerts.find((alert) => alert.id === id);
  if (!initialUserActivityAlert) {
    return new Response(null, { status: 404 });
  }

  const userActivityAlertEvent = data.notificationEvents.find(
    (event) => event.key === NotificationEventKey.UserActivityAlertsAlert,
  );
  if (!userActivityAlertEvent) {
    return new Response(null, { status: 404 });
  }

  return { convention: data.convention, initialUserActivityAlert, userActivityAlertEvent } satisfies LoaderResult;
};

function EditUserActivityAlertForm() {
  const { initialUserActivityAlert, convention, userActivityAlertEvent } = useLoaderData() as LoaderResult;

  usePageTitle('Editing user activity alert');
  const [userActivityAlert, setUserActivityAlert] = useState(initialUserActivityAlert);
  const [notificationDestinationChangeSet, addNotificationDestination, removeNotificationDestination] =
    useChangeSet<(typeof userActivityAlert)['notification_destinations'][0]>();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';
  const combinedUserActivityAlert = useMemo(
    () => ({
      ...userActivityAlert,
      notification_destinations: notificationDestinationChangeSet.apply(userActivityAlert.notification_destinations),
    }),
    [notificationDestinationChangeSet, userActivityAlert],
  );
  const confirm = useConfirm();

  const saveClicked = () => {
    const variables: Omit<UpdateUserActivityAlertMutationVariables, 'id'> = {
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
    };
    fetcher.submit(variables, { method: 'PATCH', encType: 'application/json' });
  };

  const deleteClicked = () => {
    fetcher.submit(null, { method: 'DELETE' });
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
        disabled={inProgress}
        userActivityAlertEvent={userActivityAlertEvent}
      />
      <ErrorDisplay graphQLError={error as ApolloError} />
      <button className="btn btn-primary mt-4" type="button" onClick={saveClicked} disabled={inProgress}>
        Save changes
      </button>
    </>
  );
}

export const Component = EditUserActivityAlertForm;

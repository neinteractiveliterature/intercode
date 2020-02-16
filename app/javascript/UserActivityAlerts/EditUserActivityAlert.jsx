import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useHistory } from 'react-router-dom';
import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import { useChangeSet } from '../ChangeSet';
import { useConfirm } from '../ModalDialogs/Confirm';
import { DeleteUserActivityAlert, UpdateUserActivityAlert } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { UserActivityAlertsAdminQuery, UserActivityAlertQuery } from './queries.gql';
import UserActivityAlertForm from './UserActivityAlertForm';
import useAsyncFunction from '../useAsyncFunction';
import { useDeleteMutation } from '../MutationUtils';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditUserActivityAlertForm({ initialUserActivityAlert, convention }) {
  const history = useHistory();
  const [userActivityAlert, setUserActivityAlert] = useState(initialUserActivityAlert);
  const [
    notificationDestinationChangeSet, addNotificationDestination, removeNotificationDestination,
  ] = useChangeSet();
  const [updateMutate] = useMutation(UpdateUserActivityAlert);
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
      mutation: UpdateUserActivityAlert,
      variables: {
        id: userActivityAlert.id,
        userActivityAlert: buildUserActivityAlertInput(userActivityAlert),
        addNotificationDestinations: notificationDestinationChangeSet.getAddValues()
          .map((addValue) => {
            if (addValue.staff_position) {
              return { staff_position_id: addValue.staff_position.id };
            }
            return { user_con_profile_id: addValue.user_con_profile.id };
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
          <i className="fa fa-trash-o" />
          {' '}
          Delete
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

      <ErrorDisplay graphQLError={updateError} />

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
}

EditUserActivityAlertForm.propTypes = {
  initialUserActivityAlert: PropTypes.shape({}).isRequired,
  convention: PropTypes.shape({}).isRequired,
};

function EditUserActivityAlert({ userActivityAlertId }) {
  usePageTitle('Editing user activity alert');

  const { data, loading, error } = useQuery(UserActivityAlertQuery, {
    variables: { id: userActivityAlertId },
  });
  const initialUserActivityAlert = useMemo(
    () => (error || loading ? null : data.convention.user_activity_alert),
    [data, error, loading],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditUserActivityAlertForm
      initialUserActivityAlert={initialUserActivityAlert}
      convention={data.convention}
    />
  );
}

EditUserActivityAlert.propTypes = {
  userActivityAlertId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditUserActivityAlert;

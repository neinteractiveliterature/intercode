import React from 'react';
import { humanize } from 'inflected';
import { Link } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import { UserActivityAlertsAdminQuery } from './queries.gql';
import usePageTitle from '../usePageTitle';
import useQuerySuspended from '../useQuerySuspended';

function renderCriteriaList(criteria, defaultText) {
  if (criteria.length > 0) {
    return <ul className="list-unstyled">{criteria}</ul>;
  }

  return <em>{defaultText}</em>;
}

function renderAlertMatches(userActivityAlert) {
  const matches = [];

  if (userActivityAlert.partial_name) {
    matches.push(
      <li key="partial_name">
        <strong>Partial name:</strong>
        {' '}
        <code>{userActivityAlert.partial_name}</code>
      </li>,
    );
  }

  if (userActivityAlert.email) {
    matches.push(
      <li key="email">
        <strong>Email:</strong>
        {' '}
        <code>{userActivityAlert.email}</code>
      </li>,
    );
  }

  if (userActivityAlert.user) {
    matches.push(
      <li key="user">
        <strong>User account:</strong>
        {' '}
        <code>{userActivityAlert.user.name}</code>
      </li>,
    );
  }

  return renderCriteriaList(matches, 'No match criteria');
}

function renderAlertTriggers(convention, userActivityAlert) {
  const triggers = [];

  if (userActivityAlert.trigger_on_user_con_profile_create) {
    triggers.push(<li key="user_con_profile_create">Profile creation</li>);
  }

  if (userActivityAlert.trigger_on_ticket_create && convention.ticket_mode !== 'disabled') {
    triggers.push(
      <li key="ticket_create">
        {humanize(convention.ticket_name)}
        {' '}
        creation
      </li>,
    );
  }

  return renderCriteriaList(triggers, 'Never triggers');
}

function renderAlertNotificationDestinations(userActivityAlert) {
  const destinations = userActivityAlert.notification_destinations.map((destination) => {
    if (destination.staff_position) {
      return <li key={`staff_position_${destination.staff_position.id}`}>{destination.staff_position.name}</li>;
    }

    return <li key={`user_con_profile_${destination.user_con_profile.id}`}>{destination.user_con_profile.name_without_nickname}</li>;
  });

  return renderCriteriaList(destinations, 'No destinations');
}

function UserActivityAlertsList() {
  usePageTitle('User activity alerts');
  const { data, error } = useQuerySuspended(UserActivityAlertsAdminQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">User activity alerts</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Match</th>
            <th>Trigger on</th>
            <th>Destinations</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {
            data.convention.user_activity_alerts.map((userActivityAlert) => (
              <tr key={userActivityAlert.id}>
                <td>{renderAlertMatches(userActivityAlert)}</td>
                <td>{renderAlertTriggers(data.convention, userActivityAlert)}</td>
                <td>{renderAlertNotificationDestinations(userActivityAlert)}</td>
                <td className="text-right">
                  <Link to={`/user_activity_alerts/${userActivityAlert.id}/edit`} className="btn btn-sm btn-primary">Edit</Link>
                </td>
              </tr>
            ))
          }
          {
            data.convention.user_activity_alerts.length === 0
              ? <tr><td colSpan="4"><em>No alerts configured.</em></td></tr>
              : null
          }
        </tbody>
      </table>
      <Link to="/user_activity_alerts/new" className="btn btn-primary">Create user activity alert</Link>
    </>
  );
}

export default UserActivityAlertsList;

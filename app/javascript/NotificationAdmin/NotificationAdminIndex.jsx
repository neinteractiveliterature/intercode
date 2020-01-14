import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import sortBy from 'lodash-es/sortBy';
import { humanize, tableize } from 'inflected';

import { NotificationAdminQuery } from './queries.gql';
import NotificationsConfig from '../../../config/notifications.json';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';

function describeNotificationContext(context, contextType) {
  if (context == null) {
    return `All ${humanize(tableize(contextType)).toLowerCase()} without specific config`;
  }

  if (contextType === 'EventCategory') {
    return context.name;
  }

  return JSON.stringify(context);
}

function NotificationAdminIndex() {
  const { data, loading, error } = useQuery(NotificationAdminQuery);

  const notificationTemplatesWithCategoryAndEventData = useMemo(
    () => {
      if (loading || error) {
        return [];
      }

      return data.convention.notification_templates.map(
        (notificationTemplate) => {
          const [categoryKey, eventKey] = notificationTemplate.event_key.split('/');
          const categoryIndex = NotificationsConfig.categories.findIndex(
            (category) => categoryKey === category.key,
          );
          const category = NotificationsConfig.categories[categoryIndex];
          const eventIndex = category.events.findIndex((event) => eventKey === event.key);
          const event = category.events[eventIndex];

          return ({
            ...notificationTemplate, category, event, categoryIndex, eventIndex,
          });
        },
      );
    },
    [data, error, loading],
  );

  const sortedNotificationTemplates = useMemo(
    () => sortBy(
      notificationTemplatesWithCategoryAndEventData,
      (notificationTemplate) => [
        notificationTemplate.categoryIndex, notificationTemplate.eventIndex,
      ],
    ),
    [notificationTemplatesWithCategoryAndEventData],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay />;
  }

  return (
    <>
      <h1 className="mb-4">Notifications</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Category</th>
            <th>Event</th>
            <th>Destination</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sortedNotificationTemplates.map((notificationTemplate) => (
            <tr key={notificationTemplate.event_key}>
              <td>{notificationTemplate.category.name}</td>
              <td>
                {notificationTemplate.event.name}
                {notificationTemplate.event.context_type && (
                  <>
                    <br />
                    <em>
                      {describeNotificationContext(
                        notificationTemplate.notification_context,
                        notificationTemplate.event.context_type,
                      )}
                    </em>
                  </>
                )}
              </td>
              <td>{notificationTemplate.event.destination_description}</td>
              <td>
                <Link
                  to={`/admin_notifications/${notificationTemplate.event_key}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  Configure
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default NotificationAdminIndex;

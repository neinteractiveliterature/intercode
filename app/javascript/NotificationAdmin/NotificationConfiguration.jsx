import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { useRouteMatch } from 'react-router-dom';

import { NotificationAdminQuery } from './queries.gql';
import NotificationsConfig from '../../../config/notifications.json';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import LiquidInput from '../BuiltInFormControls/LiquidInput';


function NotificationConfiguration() {
  const match = useRouteMatch();
  const category = NotificationsConfig.categories.find((c) => c.key === match.params.category);
  const event = category.events.find((e) => e.key === match.params.event);

  const { data, loading, error } = useQuery(NotificationAdminQuery);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const notificationTemplate = data.convention.notification_templates
    .find((t) => t.event_key === `${category.key}/${event.key}`);

  return (
    <>
      <h1 className="mb-4">
        {category.name}
        {' '}
        &mdash;
        {' '}
        {event.name}
      </h1>

      <LiquidInput
        value={notificationTemplate.body_html}
      />

      <LiquidInput
        value={notificationTemplate.body_text}
      />
    </>
  );
}

export default NotificationConfiguration;

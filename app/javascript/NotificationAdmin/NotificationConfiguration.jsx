import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { NotificationAdminQuery } from './queries.gql';
import NotificationsConfig from '../../../config/notifications.json';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import { UpdateNotificationTemplate } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';


function NotificationConfiguration() {
  const match = useRouteMatch();
  const history = useHistory();
  const category = NotificationsConfig.categories.find((c) => c.key === match.params.category);
  const event = category.events.find((e) => e.key === match.params.event);

  const { data, loading, error } = useQuery(NotificationAdminQuery);
  const [updateMutate] = useMutation(UpdateNotificationTemplate);
  const [
    updateNotificationTemplate, updateError, updateInProgress,
  ] = useAsyncFunction(updateMutate);

  const eventKey = `${category.key}/${event.key}`;

  const initialNotificationTemplate = (
    loading || error
      ? null
      : data.convention.notification_templates
        .find((t) => t.event_key === eventKey));

  const [notificationTemplate, setNotificationTemplate] = useState(initialNotificationTemplate);

  // if the page changes and we're still mounted
  useEffect(
    () => setNotificationTemplate(initialNotificationTemplate),
    [initialNotificationTemplate],
  );

  const saveClicked = async () => {
    await updateNotificationTemplate({
      variables: {
        eventKey,
        notificationContextType: (notificationTemplate.notification_context || {}).__typename,
        notificationContextId: (notificationTemplate.notification_context || {}).id,
        notificationTemplate: {
          subject: notificationTemplate.subject,
          body_html: notificationTemplate.body_html,
          body_text: notificationTemplate.body_text,
        },
      },
    });

    history.push('/admin_notifications');
  };

  if (loading || !notificationTemplate) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <header className="mb-4">
        <h1>
          {category.name}
          {' '}
          &mdash;
          {' '}
          {event.name}
        </h1>
        <h4>
          Destination:
          {' '}
          {event.destination_description}
        </h4>
      </header>

      <div className="form-group">
        <legend className="col-form-label">Subject line</legend>
        <LiquidInput
          value={notificationTemplate.subject}
          onChange={(value) => setNotificationTemplate((prev) => ({ ...prev, subject: value }))}
          notifierEventKey={eventKey}
          renderPreview={(previewContent) => <>{previewContent}</>}
          lines={1}
          disabled={updateInProgress}
        />
      </div>

      <div className="form-group">
        <legend className="col-form-label">Notification body (HTML)</legend>
        <LiquidInput
          value={notificationTemplate.body_html}
          onChange={(value) => setNotificationTemplate((prev) => ({ ...prev, body_html: value }))}
          notifierEventKey={eventKey}
          disabled={updateInProgress}
        />
      </div>

      <div className="form-group">
        <legend className="col-form-label">Notification body (plain text)</legend>
        <LiquidInput
          value={notificationTemplate.body_text}
          onChange={(value) => setNotificationTemplate((prev) => ({ ...prev, body_text: value }))}
          notifierEventKey={eventKey}
          renderPreview={(previewContent) => <pre style={{ whiteSpace: 'pre-wrap' }}>{previewContent}</pre>}
          disabled={updateInProgress}
        />
      </div>

      <ErrorDisplay graphQLError={updateError} />

      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={updateInProgress}>
        Save changes
      </button>
    </>
  );
}

export default NotificationConfiguration;

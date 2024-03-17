import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadQueryWrapper, ErrorDisplay, usePropertySetters } from '@neinteractiveliterature/litform';

import NotificationsConfig from '../../../config/notifications.json';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import { NotificationAdminQueryData, useNotificationAdminQuery } from './queries.generated';
import { useUpdateNotificationTemplateMutation } from './mutations.generated';
import FourOhFourPage from '../FourOhFourPage';

type NotificationConfigurationFormProps = {
  category: (typeof NotificationsConfig)['categories'][number];
  event: (typeof NotificationsConfig)['categories'][number]['events'][number];
  initialNotificationTemplate: NotificationAdminQueryData['convention']['notification_templates'][number];
  eventKey: string;
};

function NotificationConfigurationForm({
  category,
  event,
  initialNotificationTemplate,
  eventKey,
}: NotificationConfigurationFormProps) {
  const navigate = useNavigate();

  const [updateNotificationTemplate, { loading: updateInProgress, error: updateError }] =
    useUpdateNotificationTemplateMutation();

  const [notificationTemplate, setNotificationTemplate] = useState(initialNotificationTemplate);

  const [setSubject, setBodyHtml, setBodyText, setBodySms] = usePropertySetters(
    setNotificationTemplate,
    'subject',
    'body_html',
    'body_text',
    'body_sms',
  );

  // if the page changes and we're still mounted
  useEffect(() => setNotificationTemplate(initialNotificationTemplate), [initialNotificationTemplate]);

  const saveClicked = async () => {
    if (!notificationTemplate) {
      return;
    }

    await updateNotificationTemplate({
      variables: {
        eventKey,
        notificationTemplate: {
          subject: notificationTemplate.subject,
          body_html: notificationTemplate.body_html,
          body_text: notificationTemplate.body_text,
          body_sms: notificationTemplate.body_sms,
        },
      },
    });

    navigate('/admin_notifications');
  };

  if (!notificationTemplate) {
    return <FourOhFourPage />;
  }

  return (
    <>
      <header className="mb-4">
        <h1>
          {category.name} &mdash; {event.name}
        </h1>
        <h4>Destination: {event.destination_description}</h4>
      </header>

      <div className="mb-3">
        <legend className="col-form-label">Subject line</legend>
        <LiquidInput
          value={notificationTemplate.subject ?? ''}
          onChange={setSubject}
          notifierEventKey={eventKey}
          renderPreview={(previewContent) => <div className="p-2">{previewContent}</div>}
          lines={1}
          disabled={updateInProgress}
        />
      </div>

      <div className="mb-3">
        <legend className="col-form-label">Notification body (HTML)</legend>
        <LiquidInput
          value={notificationTemplate.body_html ?? ''}
          onChange={setBodyHtml}
          notifierEventKey={eventKey}
          disabled={updateInProgress}
        />
      </div>

      <div className="mb-3">
        <legend className="col-form-label">Notification body (plain text)</legend>
        <LiquidInput
          value={notificationTemplate.body_text ?? ''}
          onChange={setBodyText}
          notifierEventKey={eventKey}
          renderPreview={(previewContent) => (
            <div className="p-2">
              <pre style={{ whiteSpace: 'pre-wrap' }}>{previewContent}</pre>
            </div>
          )}
          disabled={updateInProgress}
        />
      </div>

      {event.sends_sms ? (
        <div className="mb-3">
          <legend className="col-form-label">Notification body (SMS text message)</legend>
          <LiquidInput
            value={notificationTemplate.body_sms ?? ''}
            onChange={setBodySms}
            notifierEventKey={eventKey}
            renderPreview={(previewContent) => (
              <div className="p-2">
                <pre style={{ whiteSpace: 'pre-wrap' }}>{previewContent}</pre>
              </div>
            )}
            disabled={updateInProgress}
          />
        </div>
      ) : (
        <p>
          <em>This event does not send SMS text messages.</em>
        </p>
      )}

      <ErrorDisplay graphQLError={updateError} />

      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={updateInProgress}>
        Save changes
      </button>
    </>
  );
}

export default LoadQueryWrapper(useNotificationAdminQuery, function NotificationConfiguration({ data }) {
  const params = useParams<{ category: string; event: string }>();
  const category = useMemo(
    () => NotificationsConfig.categories.find((c) => c.key === params.category),
    [params.category],
  );
  const event = useMemo(() => category?.events.find((e) => e.key === params.event), [category, params.event]);

  const eventKey = category && event ? `${category.key}/${event.key}` : 'FOUR_OH_FOUR';

  const initialNotificationTemplate = data.convention.notification_templates.find((t) => t.event_key === eventKey);

  if (!category || !event || !initialNotificationTemplate) {
    return <FourOhFourPage />;
  }

  return (
    <NotificationConfigurationForm
      category={category}
      event={event}
      eventKey={eventKey}
      initialNotificationTemplate={initialNotificationTemplate}
    />
  );
});

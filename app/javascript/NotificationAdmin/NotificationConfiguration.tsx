import { useState, useEffect } from 'react';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { ErrorDisplay, usePropertySetters } from '@neinteractiveliterature/litform';

import NotificationsConfig from '../../../config/notifications.json';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import { NotificationAdminQueryData, NotificationAdminQueryDocument } from './queries.generated';
import { useUpdateNotificationTemplateMutation } from './mutations.generated';
import FourOhFourPage from '../FourOhFourPage';
import { client } from '../useIntercodeApolloClient';

type LoaderResult = {
  category: (typeof NotificationsConfig)['categories'][number];
  event: (typeof NotificationsConfig)['categories'][number]['events'][number];
  initialNotificationTemplate: NotificationAdminQueryData['convention']['notification_templates'][number];
};

export const loader: LoaderFunction = async ({ params }) => {
  const category = NotificationsConfig.categories.find((c) => c.key === params.category);
  const event = category?.events.find((e) => e.key === params.event);
  if (!category || !event) {
    return new Response(null, { status: 404 });
  }

  const { data } = await client.query<NotificationAdminQueryData>({ query: NotificationAdminQueryDocument });
  const initialNotificationTemplate = data.convention.notification_templates.find(
    (t) => t.event_key === `${category.key}/${event.key}`,
  );
  if (!initialNotificationTemplate) {
    return new Response(null, { status: 404 });
  }

  return { category, event, initialNotificationTemplate } satisfies LoaderResult;
};

function NotificationConfigurationForm() {
  const { category, event, initialNotificationTemplate } = useLoaderData() as LoaderResult;
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
        eventKey: notificationTemplate.event_key,
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
          notifierEventKey={notificationTemplate.event_key}
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
          notifierEventKey={notificationTemplate.event_key}
          disabled={updateInProgress}
        />
      </div>

      <div className="mb-3">
        <legend className="col-form-label">Notification body (plain text)</legend>
        <LiquidInput
          value={notificationTemplate.body_text ?? ''}
          onChange={setBodyText}
          notifierEventKey={notificationTemplate.event_key}
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
            notifierEventKey={notificationTemplate.event_key}
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

export const Component = NotificationConfigurationForm;

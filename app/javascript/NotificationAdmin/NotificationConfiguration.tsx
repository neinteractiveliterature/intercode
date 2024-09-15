import { useState, useEffect } from 'react';
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { ErrorDisplay, usePropertySetters } from '@neinteractiveliterature/litform';

import NotificationsConfig from '../../../config/notifications.json';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import { NotificationAdminQueryData, NotificationAdminQueryDocument } from './queries.generated';
import FourOhFourPage from '../FourOhFourPage';
import { client } from '../useIntercodeApolloClient';
import { ApolloError } from '@apollo/client';
import { UpdateNotificationTemplateDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { category, event }, request }) => {
  try {
    const formData = await request.formData();

    const { data } = await client.mutate({
      mutation: UpdateNotificationTemplateDocument,
      variables: {
        eventKey: `${category}/${event}`,
        notificationTemplate: {
          subject: formData.get('subject')?.toString(),
          body_html: formData.get('body_html')?.toString(),
          body_text: formData.get('body_text')?.toString(),
          body_sms: formData.get('body_sms')?.toString(),
        },
      },
    });

    return redirect('/admin_notifications');
  } catch (error) {
    return error;
  }
};

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
  const navigation = useNavigation();
  const data = useActionData();
  const updateError = data instanceof Error ? data : undefined;
  const updateInProgress = navigation.state !== 'idle';

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

  return (
    <Form method="PATCH">
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
        <input type="hidden" name="subject" value={notificationTemplate.subject ?? ''} />
      </div>

      <div className="mb-3">
        <legend className="col-form-label">Notification body (HTML)</legend>
        <LiquidInput
          value={notificationTemplate.body_html ?? ''}
          onChange={setBodyHtml}
          notifierEventKey={notificationTemplate.event_key}
          disabled={updateInProgress}
        />
        <input type="hidden" name="body_html" value={notificationTemplate.body_html ?? ''} />
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
        <input type="hidden" name="body_text" value={notificationTemplate.body_text ?? ''} />
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
          <input type="hidden" name="body_sms" value={notificationTemplate.body_sms ?? ''} />
        </div>
      ) : (
        <p>
          <em>This event does not send SMS text messages.</em>
        </p>
      )}

      <ErrorDisplay graphQLError={updateError as ApolloError} />

      <button type="submit" className="btn btn-primary" disabled={updateInProgress}>
        Save changes
      </button>
    </Form>
  );
}

export const Component = NotificationConfigurationForm;

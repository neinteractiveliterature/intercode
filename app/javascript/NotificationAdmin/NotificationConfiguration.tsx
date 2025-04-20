import { useState, useEffect } from 'react';
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from 'react-router-dom';
import { ErrorDisplay, usePropertySetters } from '@neinteractiveliterature/litform';

import LiquidInput from '../BuiltInFormControls/LiquidInput';
import { NotificationAdminQueryData, NotificationAdminQueryDocument } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { ApolloError } from '@apollo/client';
import { UpdateNotificationTemplateDocument } from './mutations.generated';
import NotificationDestinationsConfig from './NotificationDestinationsConfig';
import { useTranslation } from 'react-i18next';
import { useChangeSet } from 'ChangeSet';
import { NotificationDestinationInput, NotificationEventKey } from 'graphqlTypes.generated';

export const action: ActionFunction = async ({ params: { eventKey }, request }) => {
  try {
    const formData = await request.formData();
    const addDestinations = JSON.parse(
      formData.get('add_destinations')?.toString() ?? '[]',
    ) as NotificationAdminQueryData['convention']['notification_templates'][number]['notification_destinations'];
    const removeDestinationIds = JSON.parse(formData.get('remove_destination_ids')?.toString() ?? '[]') as string[];

    await client.mutate({
      mutation: UpdateNotificationTemplateDocument,
      variables: {
        eventKey: eventKey as NotificationEventKey,
        notificationTemplate: {
          subject: formData.get('subject')?.toString(),
          body_html: formData.get('body_html')?.toString(),
          body_text: formData.get('body_text')?.toString(),
          body_sms: formData.get('body_sms')?.toString(),
        },
        addDestinations: addDestinations.map(
          (destination) =>
            ({
              staffPositionId: destination.staff_position?.id,
              userConProfileId: destination.user_con_profile?.id,
              conditions: destination.conditions
                ? destination.conditions.map((c) => ({ conditionType: c.condition_type, value: c.value }))
                : undefined,
              dynamicDestination: destination.dynamic_destination,
            }) satisfies NotificationDestinationInput,
        ),
        removeDestinationIds,
      },
    });

    return redirect('/admin_notifications');
  } catch (error) {
    return error;
  }
};

type LoaderResult = {
  event: NotificationAdminQueryData['notificationEvents'][number];
  initialNotificationTemplate: NotificationAdminQueryData['convention']['notification_templates'][number];
  staffPositions: NotificationAdminQueryData['convention']['staff_positions'];
  eventCategories: NotificationAdminQueryData['convention']['event_categories'];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { eventKey } = params;
  const { data } = await client.query({ query: NotificationAdminQueryDocument });
  const initialNotificationTemplate = data.convention.notification_templates.find((t) => t.event_key === eventKey);

  if (!initialNotificationTemplate) {
    throw new Response(null, { status: 404 });
  }
  const event = data.notificationEvents.find((e) => e.key === eventKey);
  if (!event) {
    throw new Response(null, { status: 404 });
  }

  return {
    event,
    initialNotificationTemplate,
    staffPositions: data.convention.staff_positions,
    eventCategories: data.convention.event_categories,
  } satisfies LoaderResult;
};

function NotificationConfigurationForm() {
  const { t } = useTranslation();
  const { event, initialNotificationTemplate, staffPositions, eventCategories } = useLoaderData() as LoaderResult;
  const navigation = useNavigation();
  const data = useActionData();
  const updateError = data instanceof Error ? data : undefined;
  const updateInProgress = navigation.state !== 'idle';

  const [notificationTemplate, setNotificationTemplate] = useState(initialNotificationTemplate);
  const [destinationsChangeSet, addDestination, removeDestination] =
    useChangeSet<(typeof notificationTemplate.notification_destinations)[number]>();

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
        <h1>{t(`admin.notifications.events.${event.key}`)}</h1>
      </header>

      <NotificationDestinationsConfig
        addDestination={addDestination}
        notificationDestinations={destinationsChangeSet.apply(notificationTemplate.notification_destinations)}
        eventCategories={eventCategories}
        removeDestination={removeDestination}
        disabled={updateInProgress}
        staffPositions={staffPositions}
        allowedConditionTypes={event.allowed_condition_types}
        allowedDynamicDestinations={event.allowed_dynamic_destinations}
      />
      <input type="hidden" name="add_destinations" value={JSON.stringify(destinationsChangeSet.getAddValues())} />
      <input type="hidden" name="remove_destination_ids" value={JSON.stringify(destinationsChangeSet.getRemoveIds())} />

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

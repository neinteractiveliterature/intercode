import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import buildEventCategoryUrl from './buildEventCategoryUrl';
import RunFormFields, { RunForRunFormFields } from '../BuiltInForms/RunFormFields';
import useAsyncFunction from '../useAsyncFunction';
import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import useCreateEvent, { CreateEventOptions } from './useCreateEvent';
import usePageTitle from '../usePageTitle';
import { useEventAdminEventsQuery, EventAdminEventsQueryData } from './queries.generated';
import { buildEventInput } from './InputBuilders';
import { FormItemRole, SchedulingUi } from '../graphqlTypes.generated';

type NewEventFormResponseAttrs = {
  length_seconds?: number | null;
  can_play_concurrently?: boolean | null;
  title?: string | null;
};

type EventCategoryType = NonNullable<EventAdminEventsQueryData['convention']>['event_categories'][0];

type NewEventFormEvent = {
  event_category?: EventCategoryType | null;
  form_response_attrs: NewEventFormResponseAttrs;
  current_user_form_item_viewer_role: FormItemRole;
  current_user_form_item_writer_role: FormItemRole;
};

function runIsCreatable(run: RunForRunFormFields): run is Omit<RunForRunFormFields, 'starts_at'> & {
  starts_at: NonNullable<RunForRunFormFields['starts_at']>;
} {
  return run.starts_at != null;
}

export default LoadQueryWrapper(useEventAdminEventsQuery, function NewEvent({ data }) {
  const convention = data.convention;
  const navigate = useNavigate();
  const { eventCategoryId: eventCategoryIdParam } = useParams<{ eventCategoryId: string }>();
  const initialEventCategory = useMemo(
    () => convention.event_categories.find((c) => c.id === eventCategoryIdParam),
    [convention, eventCategoryIdParam],
  );
  const [createMutate, createError] = useAsyncFunction<unknown, [CreateEventOptions]>(useCreateEvent(convention));
  const initialEvent = useMemo<NewEventFormEvent>(
    () => ({
      form_response_attrs: {},
      event_category: initialEventCategory,
      // if you're on the event admin app, you're an admin for events by definition
      current_user_form_item_viewer_role: FormItemRole.Admin,
      current_user_form_item_writer_role: FormItemRole.Admin,
    }),
    [initialEventCategory],
  );
  const [formProps, { event, eventCategory, eventCategoryId, validateForm }] = useEventFormWithCategorySelection<
    EventCategoryType,
    NewEventFormEvent
  >({
    convention,
    schedulingUi: initialEventCategory ? initialEventCategory.scheduling_ui : null,
    initialEvent,
  });
  const [run, setRun] = useState<RunForRunFormFields>({
    __typename: 'Run',
    id: '',
    rooms: [],
    starts_at: '',
  });
  usePageTitle('New event');

  const donePath = convention.site_mode === 'single_event' ? '/' : buildEventCategoryUrl(eventCategory) ?? '/';

  const createEvent = async () => {
    if (!validateForm() || !runIsCreatable(run) || !eventCategory) {
      return;
    }

    const eventForBuildEventInput: Parameters<typeof buildEventInput>[0] = {
      ...event,
      event_category: eventCategory,
    };

    if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
      await createMutate({
        event: eventForBuildEventInput,
        eventCategory,
        run,
      });
    } else {
      await createMutate({
        event: eventForBuildEventInput,
        eventCategory,
      });
    }
    navigate(donePath);
  };

  const warningMessage =
    eventCategory?.scheduling_ui === 'single_run' && !event.form_response_attrs.length_seconds
      ? 'Please specify a length of time for this event.'
      : null;

  return (
    <>
      <h2 className="mb-4 mt-2">New event</h2>
      <EventFormWithCategorySelection {...formProps} />

      {eventCategory && eventCategory.scheduling_ui === 'single_run' && event.form_response_attrs.length_seconds && (
        <RunFormFields
          run={run}
          event={{
            __typename: 'Event',
            id: '',
            // if you're on the event admin app, you're an admin for events by definition
            current_user_form_item_viewer_role: FormItemRole.Admin,
            current_user_form_item_writer_role: FormItemRole.Admin,
            can_play_concurrently: event.form_response_attrs.can_play_concurrently ?? false,
            title: event.form_response_attrs.title,
            length_seconds: event.form_response_attrs.length_seconds,
            event_category: eventCategory,
            maximum_event_provided_tickets_overrides: [],
            runs: [],
          }}
          onChange={setRun}
        />
      )}

      {warningMessage && <div className="alert alert-warning">{warningMessage}</div>}

      <ErrorDisplay graphQLError={createError as ApolloError} />

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={createEvent}
          disabled={!eventCategoryId || !!warningMessage}
        >
          Create event
        </button>
        <Link className="btn btn-link" to={donePath}>
          Cancel
        </Link>
      </div>
    </>
  );
});

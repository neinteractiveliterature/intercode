import { useState, useMemo } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import buildEventCategoryUrl from './buildEventCategoryUrl';
import RunFormFields, { RunForRunFormFields } from '../BuiltInForms/RunFormFields';
import useAsyncFunction from '../useAsyncFunction';
import useEventFormWithCategorySelection, {
  EventFormWithCategorySelection,
} from './useEventFormWithCategorySelection';
import useCreateEvent from './useCreateEvent';
import usePageTitle from '../usePageTitle';
import { useEventAdminEventsQuery, EventAdminEventsQueryData } from './queries.generated';
import { buildEventInput } from './InputBuilders';
import { FormItemRole } from '../graphqlTypes.generated';

type NewEventFormProps = {
  data: EventAdminEventsQueryData;
};

type NewEventFormResponseAttrs = {
  length_seconds?: number | null;
  can_play_concurrently?: boolean | null;
  title?: string | null;
};

type EventCategoryType = NonNullable<
  EventAdminEventsQueryData['convention']
>['event_categories'][0];

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

function NewEventForm({ data }: NewEventFormProps) {
  const convention = data.convention!;
  const history = useHistory();
  const { eventCategoryId: eventCategoryIdParam } = useParams<{ eventCategoryId: string }>();
  const initialEventCategory = useMemo(
    () =>
      convention.event_categories.find((c) => c.id === Number.parseInt(eventCategoryIdParam, 10)),
    [convention, eventCategoryIdParam],
  );
  const [createMutate, createError] = useAsyncFunction(useCreateEvent());
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
  const [formProps, { event, eventCategory, eventCategoryId, validateForm }] =
    useEventFormWithCategorySelection<EventCategoryType, NewEventFormEvent>({
      convention,
      schedulingUi: initialEventCategory ? initialEventCategory.scheduling_ui : null,
      initialEvent,
    });
  const [run, setRun] = useState<RunForRunFormFields>({
    __typename: 'Run',
    id: -1,
    rooms: [],
    starts_at: '',
  });

  const donePath =
    convention.site_mode === 'single_event' ? '/' : buildEventCategoryUrl(eventCategory) ?? '/';

  const createEvent = async () => {
    if (!validateForm() || !runIsCreatable(run)) {
      return;
    }

    const eventForBuildEventInput: Parameters<typeof buildEventInput>[0] = {
      ...event!,
      event_category: eventCategory!,
    };

    await createMutate({
      event: eventForBuildEventInput,
      eventCategory: eventCategory!,
      run,
    });
    history.push(donePath);
  };

  const warningMessage =
    eventCategory?.scheduling_ui === 'single_run' && !event.form_response_attrs.length_seconds
      ? 'Please specify a length of time for this event.'
      : null;

  return (
    <>
      <h2 className="mb-4 mt-2">New event</h2>
      <EventFormWithCategorySelection {...formProps} />

      {eventCategory &&
        eventCategory.scheduling_ui === 'single_run' &&
        event.form_response_attrs.length_seconds && (
          <RunFormFields
            run={run}
            event={{
              __typename: 'Event',
              id: -1,
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
}

function NewEvent() {
  const { data, loading, error } = useEventAdminEventsQuery();

  usePageTitle('New event');

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <NewEventForm data={data!} />;
}

export default NewEvent;

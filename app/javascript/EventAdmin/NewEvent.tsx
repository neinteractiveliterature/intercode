import React, { useState, useMemo } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';

import buildEventCategoryUrl from './buildEventCategoryUrl';
import ErrorDisplay from '../ErrorDisplay';
import RunFormFields, { RunForRunFormFields } from '../BuiltInForms/RunFormFields';
import useAsyncFunction from '../useAsyncFunction';
import useEventFormWithCategorySelection, {
  EventFormWithCategorySelection,
} from './useEventFormWithCategorySelection';
import useCreateEvent from './useCreateEvent';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { useEventAdminEventsQueryQuery, EventAdminEventsQueryQuery } from './queries.generated';
import { buildEventInput } from './InputBuilders';

type NewEventFormProps = {
  data: EventAdminEventsQueryQuery;
};

type NewEventFormResponseAttrs = {
  length_seconds?: number | null;
  can_play_concurrently?: boolean | null;
  title?: string | null;
};

type EventCategoryType = NonNullable<
  EventAdminEventsQueryQuery['convention']
>['event_categories'][0];

type NewEventFormEvent = {
  event_category?: EventCategoryType | null;
  form_response_attrs: NewEventFormResponseAttrs;
};

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
  const initialEvent = useMemo(
    () => ({
      form_response_attrs: {},
      event_category: initialEventCategory,
    }),
    [initialEventCategory],
  );
  const [
    formProps,
    { event, eventCategory, eventCategoryId, validateForm },
  ] = useEventFormWithCategorySelection<EventCategoryType, NewEventFormEvent>({
    convention,
    schedulingUi: initialEventCategory ? initialEventCategory.scheduling_ui : null,
    initialEvent,
  });
  const [run, setRun] = useState<RunForRunFormFields>();

  const donePath =
    convention.site_mode === 'single_event' ? '/' : buildEventCategoryUrl(eventCategory) ?? '/';

  const createEvent = async () => {
    if (!validateForm()) {
      return;
    }

    const eventForBuildEventInput: Parameters<typeof buildEventInput>[0] = {
      ...event!,
      event_category: eventCategory!
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
      <EventFormWithCategorySelection {...formProps}>
        {eventCategory &&
          eventCategory.scheduling_ui === 'single_run' &&
          event.form_response_attrs.length_seconds && (
            <RunFormFields
              run={run ?? { id: -1, rooms: [], starts_at: '' }}
              event={{
                id: -1,
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
      </EventFormWithCategorySelection>
    </>
  );
}

function NewEvent() {
  const { data, loading, error } = useEventAdminEventsQueryQuery();

  usePageTitle('New event');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <NewEventForm data={data!} />;
}

export default NewEvent;

import React, { useCallback } from 'react';
import {
  Link,
  Switch,
  Route,
} from 'react-router-dom';

import { EventAdminEventsQuery } from './queries.gql';
import FillerEventForm from '../BuiltInForms/FillerEventForm';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import { timespanFromRun } from '../TimespanUtils';
import {
  CreateFillerEvent,
  CreateRun,
  DropEvent,
  UpdateEvent,
  UpdateRun,
} from './mutations.gql';
import deserializeEvent from './deserializeEvent';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import useMutationCallback from '../useMutationCallback';
import { useConfirm } from '../ModalDialogs/Confirm';

const buildEventInput = (event, defaultFormResponseAttrs = {}) => ({
  event: {
    event_category_id: event.event_category.id,
    form_response_attrs_json: JSON.stringify({
      ...defaultFormResponseAttrs,
      ...event.form_response_attrs,
    }),
  },
});

const buildRunInput = (run) => {
  if (!run.starts_at) {
    return null;
  }

  return {
    run: {
      starts_at: run.starts_at,
      schedule_note: run.schedule_note,
      title_suffix: run.title_suffix,
      room_ids: run.rooms.map(room => room.id),
    },
  };
};

function useUpdateSingleRunEvent() {
  const updateEvent = useMutationCallback(UpdateEvent);
  const createRun = useMutationCallback(CreateRun);
  const updateRun = useMutationCallback(UpdateRun);

  return useCallback(
    async ({ event, run }) => {
      const eventInput = {
        ...buildEventInput(event),
        id: event.id,
      };

      await updateEvent({ variables: { input: eventInput } });
      if (run.id) {
        await updateRun({
          variables: {
            input: {
              ...buildRunInput(run),
              id: run.id,
            },
          },
        });
      } else if (run) {
        await createRun({
          variables: {
            input: {
              ...buildRunInput(run),
              event_id: event.id,
            },
          },
          update: (store, { data: { createRun: { run: newRun } } }) => {
            const eventsData = store.readQuery({ query: EventAdminEventsQuery });
            store.writeQuery({
              query: EventAdminEventsQuery,
              data: {
                ...eventsData,
                events: eventsData.events.map((existingEvent) => {
                  if (existingEvent.id === event.id) {
                    return {
                      ...existingEvent,
                      runs: [
                        ...existingEvent.runs,
                        newRun,
                      ],
                    };
                  }

                  return existingEvent;
                }),
              },
            });
          },
        });
      }
    },
    [createRun, updateEvent, updateRun],
  );
}

function NewSingleRunEvent({ history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const [mutate, mutationError, mutationInProgress] = useAsyncFunction(
    useMutationCallback(CreateFillerEvent),
  );

  const createFillerEvent = useCallback(
    async ({ event, run }) => {
      const input = {
        ...buildEventInput(
          event,
          {
            can_play_concurrently: false,
            con_mail_destination: 'event_email',
            author: '{{ convention.name }} Staff',
          },
        ),
        ...buildRunInput(run),
      };

      await mutate({
        variables: { input },
        update: (store, { data: { createFillerEvent: { event: newEvent } } }) => {
          const eventsData = store.readQuery({ query: EventAdminEventsQuery });
          eventsData.events.push(newEvent);
          store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
        },
      });

      history.push('/filler_events');
    },
    [mutate, history],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <FillerEventForm
        disabled={mutationInProgress}
        error={mutationError ? mutationError.message : null}
        initialEvent={{
          event_category: { id: null },
          form_response_attrs: {
            email: '',
            short_blurb: '',
            description: '',
            title: '',
            registration_policy: { buckets: [] },
          },
          runs: [{ rooms: [] }],
        }}
        convention={data.convention}
        cancelPath="/filler_events"
        onSave={createFillerEvent}
      />
    </div>
  );
}

function EditSingleRunEvent({ match, history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const [update, updateError, updateInProgress] = useAsyncFunction(useUpdateSingleRunEvent());

  const updateSingleRunEvent = useCallback(
    async (options) => {
      update(options);
      history.push('/filler_events');
    },
    [update, history],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const event = data.events.find(e => e.id.toString() === match.params.id);

  return (
    <div>
      <FillerEventForm
        disabled={updateInProgress}
        error={updateError ? updateError.message : null}
        initialEvent={deserializeEvent(event)}
        convention={data.convention}
        cancelPath="/filler_events"
        onSave={updateSingleRunEvent}
      />
    </div>
  );
}

function SingleRunEventAdminList() {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const drop = useMutationCallback(DropEvent);
  const confirm = useConfirm();

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const singleRunEvents = data.events.filter((event) => {
    const eventCategory = data.convention.event_categories
      .find(c => c.id === event.event_category.id);
    return eventCategory.scheduling_ui === 'single_run' && event.status === 'active';
  });
  singleRunEvents.sort((a, b) => {
    if (!a.runs[0]) {
      return -1;
    }

    if (!b.runs[0]) {
      return 1;
    }

    const timespanA = timespanFromRun(data.convention, a, a.runs[0]);
    const timespanB = timespanFromRun(data.convention, b, b.runs[0]);

    return timespanA.start.diff(timespanB.start);
  });
  const eventRows = singleRunEvents.map((event) => {
    const run = event.runs[0];
    let timespan;
    if (run) {
      timespan = timespanFromRun(data.convention, event, run);
    }

    const eventCategory = data.convention.event_categories
      .find(c => c.id === event.event_category.id);

    return (
      <tr className={event.id}>
        <th scope="row">
          <span
            className="rounded p-1 text-dark"
            style={getEventCategoryStyles({ eventCategory, variant: 'default' })}
          >
            {event.title}
          </span>
        </th>
        <td>
          {timespan && timespan.humanizeInTimezone(data.convention.timezone_name)}
        </td>
        <td>
          <Link className="btn btn-secondary btn-sm" to={`/filler_events/${event.id}/edit`}>
            Edit
          </Link>
          {' '}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => confirm({
              prompt: 'Are you sure you want to drop this event?',
              action: () => drop({ variables: { input: { id: event.id } } }),
              renderError: e => <ErrorDisplay graphQLError={e} />,
            })}
          >
            <i className="fa fa-trash-o" />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Link className="btn btn-primary my-4" to="/filler_events/new">
        Create new single-run event
      </Link>
      <table className="table table-striped">
        <tbody>
          {eventRows}
        </tbody>
      </table>
    </div>
  );
}

function FillerEventAdmin() {
  return (
    <Switch>
      <Route path="/filler_events/new" component={NewSingleRunEvent} />
      <Route path="/filler_events/:id/edit" component={EditSingleRunEvent} />
      <Route component={SingleRunEventAdminList} />
    </Switch>
  );
}

export default FillerEventAdmin;

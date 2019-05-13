import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { buildEventInput, buildRunInput } from './SingleRunEventUtils';
import deserializeEvent from './deserializeEvent';
import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import SingleRunEventForm from './SingleRunEventForm';
import { UpdateEvent, UpdateRun, CreateRun } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import useMutationCallback from '../useMutationCallback';
import useQuerySuspended from '../useQuerySuspended';

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

      const runInput = buildRunInput(run);

      if (run.id) {
        await updateRun({
          variables: {
            input: {
              ...runInput,
              id: run.id,
            },
          },
        });
      } else if (runInput) {
        await createRun({
          variables: {
            input: {
              ...runInput,
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

function EditSingleRunEvent({ match, history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const [update, updateError, updateInProgress] = useAsyncFunction(useUpdateSingleRunEvent());

  const updateSingleRunEvent = useCallback(
    async (options) => {
      await update(options);
      history.push('/admin_events/filler_events');
    },
    [update, history],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const event = data.events.find(e => e.id.toString() === match.params.id);

  return (
    <div>
      <SingleRunEventForm
        disabled={updateInProgress}
        error={updateError ? updateError.message : null}
        initialEvent={deserializeEvent(event)}
        convention={data.convention}
        cancelPath="/admin_events/filler_events"
        onSave={updateSingleRunEvent}
      />
    </div>
  );
}

EditSingleRunEvent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EditSingleRunEvent);

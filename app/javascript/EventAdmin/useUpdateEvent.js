import { useCallback } from 'react';

import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventAdminEventsQuery } from './queries.gql';
import { UpdateEvent, CreateRun, UpdateRun } from './mutations.gql';
import useMutationCallback from '../useMutationCallback';

function useUpdateRegularEvent() {
  const updateEventMutate = useMutationCallback(UpdateEvent);
  const updateEvent = useCallback(
    ({ event }) => updateEventMutate({
      variables: {
        input: {
          ...buildEventInput(event),
          id: event.id,
        },
      },
    }),
    [updateEventMutate],
  );

  return updateEvent;
}

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

export default function useUpdateEvent() {
  const updateRegularEvent = useUpdateRegularEvent();
  const updateSingleRunEvent = useUpdateSingleRunEvent();

  const updateEvent = useCallback(
    ({ event, eventCategory, ...args }) => {
      if (eventCategory.scheduling_ui === 'single_run') {
        return updateSingleRunEvent({ event, ...args });
      }

      return updateRegularEvent({ event, ...args });
    },
    [updateRegularEvent, updateSingleRunEvent],
  );

  return updateEvent;
}

import { useCallback } from 'react';

import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventAdminEventsQuery } from './queries';
import {
  useCreateRunMutation,
  useUpdateEventMutation,
  useUpdateRunMutation,
} from './mutations.generated';
import { EventAdminEventsQueryData } from './queries.generated';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';

function useUpdateRegularEvent() {
  const [updateEventMutate] = useUpdateEventMutation();
  const updateEvent = useCallback(
    ({ event }: { event: Parameters<typeof buildEventInput>[0] & { id: number } }) =>
      updateEventMutate({
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
  const [updateEvent] = useUpdateEventMutation();
  const [createRun] = useCreateRunMutation();
  const [updateRun] = useUpdateRunMutation();

  return useCallback(
    async ({
      event,
      run,
    }: {
      event: Parameters<typeof buildEventInput>[0] & { id: number };
      run: Parameters<typeof buildRunInput>[0] & { id?: number | null };
    }) => {
      const eventInput = {
        ...buildEventInput(event),
        id: event.id,
      };

      await updateEvent({ variables: { input: eventInput } });

      const runInput = buildRunInput(run);

      if (run.id && runInput) {
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
          update: (store, { data }) => {
            const eventsData = store.readQuery<EventAdminEventsQueryData>({
              query: EventAdminEventsQuery,
            });
            const newRun = data?.createRun?.run;
            if (!newRun || !eventsData) {
              return;
            }

            store.writeQuery({
              query: EventAdminEventsQuery,
              data: {
                ...eventsData,
                events: eventsData.events.map((existingEvent) => {
                  if (existingEvent.id === event.id) {
                    return {
                      ...existingEvent,
                      runs: [...existingEvent.runs, newRun],
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
    ({
      event,
      eventCategory,
      run,
    }: {
      event: Parameters<typeof buildEventInput>[0] & { id: number };
      eventCategory: Pick<EventCategory, 'scheduling_ui'>;
      run?: Parameters<typeof buildRunInput>[0] & { id?: number | null };
    }) => {
      if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
        if (!run) {
          throw new Error('When updating a single-run event, the run must be provided');
        }
        return updateSingleRunEvent({ event, run });
      }

      return updateRegularEvent({ event });
    },
    [updateRegularEvent, updateSingleRunEvent],
  );

  return updateEvent;
}

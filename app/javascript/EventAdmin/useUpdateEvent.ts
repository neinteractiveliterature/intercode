import { useCallback } from 'react';

import { buildEventInput, buildRunInput } from './InputBuilders';
import { useCreateRunMutation, useUpdateEventMutation, useUpdateRunMutation } from './mutations.generated';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';

export type UseUpdateRegularEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
};

function useUpdateRegularEvent(): (options: UseUpdateRegularEventOptions) => Promise<void> {
  const [updateEventMutate] = useUpdateEventMutation();
  const updateEvent = useCallback(
    async ({ event }: UseUpdateRegularEventOptions) => {
      await updateEventMutate({
        variables: {
          input: {
            ...buildEventInput(event),
            id: event.id,
          },
        },
      });
    },
    [updateEventMutate],
  );

  return updateEvent;
}

export type UseUpdateSingleRunEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  run: Parameters<typeof buildRunInput>[0] & { id?: string | null };
};

function useUpdateSingleRunEvent(): (options: UseUpdateSingleRunEventOptions) => Promise<void> {
  const [updateEvent] = useUpdateEventMutation();
  const [createRun] = useCreateRunMutation();
  const [updateRun] = useUpdateRunMutation();

  return useCallback(
    async ({ event, run }: UseUpdateSingleRunEventOptions) => {
      await updateEvent({ variables: { input: { ...buildEventInput(event), id: event.id } } });

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
              eventId: event.id,
            },
          },
          update: (store, { data }) => {
            const eventsData = store.readQuery<EventAdminEventsQueryData>({
              query: EventAdminEventsQueryDocument,
            });
            const newRun = data?.createRun?.run;
            if (!newRun || !eventsData) {
              return;
            }

            store.writeQuery<EventAdminEventsQueryData>({
              query: EventAdminEventsQueryDocument,
              data: {
                ...eventsData,
                convention: {
                  ...eventsData.convention,
                  events: eventsData.convention.events.map((existingEvent) => {
                    if (existingEvent.id === event.id) {
                      return {
                        ...existingEvent,
                        runs: [...existingEvent.runs, newRun],
                      };
                    }

                    return existingEvent;
                  }),
                },
              },
            });
          },
        });
      }
    },
    [createRun, updateEvent, updateRun],
  );
}

export type UseUpdateEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  eventCategory: Pick<EventCategory, 'scheduling_ui'>;
  run?: Parameters<typeof buildRunInput>[0] & { id?: string | null };
};

export default function useUpdateEvent(): (options: UseUpdateEventOptions) => Promise<void> {
  const updateRegularEvent = useUpdateRegularEvent();
  const updateSingleRunEvent = useUpdateSingleRunEvent();

  const updateEvent = useCallback(
    ({ event, eventCategory, run }: UseUpdateEventOptions) => {
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

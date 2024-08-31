import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';
import { CreateRunDocument, UpdateEventDocument, UpdateRunDocument } from './mutations.generated';

export type UpdateRegularEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
};

export async function updateRegularEvent({ event }: UpdateRegularEventOptions) {
  await client.mutate({
    mutation: UpdateEventDocument,
    variables: {
      input: {
        ...buildEventInput(event),
        id: event.id,
      },
    },
  });
}

export type UpdateSingleRunEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  run: Parameters<typeof buildRunInput>[0] & { id?: string | null };
};

export async function updateSingleRunEvent({ event, run }: UpdateSingleRunEventOptions) {
  await client.mutate({
    mutation: UpdateEventDocument,
    variables: { input: { ...buildEventInput(event), id: event.id } },
  });

  const runInput = buildRunInput(run);

  if (run.id && runInput) {
    await client.mutate({
      mutation: UpdateRunDocument,
      variables: {
        input: { ...runInput, id: run.id },
      },
    });
  } else if (runInput) {
    await client.mutate({
      mutation: CreateRunDocument,
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
}

export type UpdateEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  eventCategory: Pick<EventCategory, 'scheduling_ui'>;
  run?: Parameters<typeof buildRunInput>[0] & { id?: string | null };
};

export function updateEvent({ event, eventCategory, run }: UpdateEventOptions) {
  if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
    if (!run) {
      throw new Error('When updating a single-run event, the run must be provided');
    }
    return updateSingleRunEvent({ event, run });
  }

  return updateRegularEvent({ event });
}

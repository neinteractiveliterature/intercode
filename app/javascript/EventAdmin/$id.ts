import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';
import { CreateRunDocument, UpdateEventDocument, UpdateRunDocument } from './mutations.generated';
import { redirect } from 'react-router';
import { Route } from './+types/$id';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type UpdateRegularEventOptions = {
  client: ApolloClient<NormalizedCacheObject>;

  event: Parameters<typeof buildEventInput>[0] & { id: string };
};

export async function updateRegularEvent({ event, client }: UpdateRegularEventOptions) {
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
  client: ApolloClient<NormalizedCacheObject>;
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  run: Parameters<typeof buildRunInput>[0] & { id?: string | null };
};

export async function updateSingleRunEvent({ event, run, client }: UpdateSingleRunEventOptions) {
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
  client: ApolloClient<NormalizedCacheObject>;
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  eventCategory: Pick<EventCategory, 'scheduling_ui' | 'id'>;
  run?: (Parameters<typeof buildRunInput>[0] & { id?: string | null }) | null;
};

async function updateEvent({ event, eventCategory, run, client }: UpdateEventOptions) {
  if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
    if (!run) {
      throw new Error('When updating a single-run event, the run must be provided');
    }
    return await updateSingleRunEvent({ event, run, client });
  }

  return await updateRegularEvent({ event, client });
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const options = (await request.json()) as Omit<UpdateEventOptions, 'client'>;
    await updateEvent({ ...options, client: context.client });
    return redirect(`/admin_events/${options.eventCategory.id}`);
  } catch (error) {
    return error;
  }
}

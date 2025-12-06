import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';
import { apolloClientContext } from 'AppContexts';
import { CreateOrUpdateRunForEventDocument, UpdateEventDocument } from './mutations.generated';
import { ActionFunction, redirect, RouterContextProvider } from 'react-router';
import { ApolloClient } from '@apollo/client';

export type UpdateRegularEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  client: ApolloClient;
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
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  run: Parameters<typeof buildRunInput>[0] & { id?: string | null };
  client: ApolloClient;
};

export async function updateSingleRunEvent({ event, run, client }: UpdateSingleRunEventOptions) {
  await client.mutate({
    mutation: UpdateEventDocument,
    variables: { input: { ...buildEventInput(event), id: event.id } },
  });

  const runInput = buildRunInput(run);

  if (runInput) {
    await client.mutate({
      mutation: CreateOrUpdateRunForEventDocument,
      variables: {
        input: {
          ...runInput,
          eventId: event.id,
        },
      },
      update: (cache) => {
        cache.modify({
          id: cache.identify(event),
          fields: {
            events: (value, { INVALIDATE }) => INVALIDATE,
          },
        });
      },
    });
  }
}

export type UpdateEventOptions = {
  event: Parameters<typeof buildEventInput>[0] & { id: string };
  eventCategory: Pick<EventCategory, 'scheduling_ui' | 'id'>;
  run?: (Parameters<typeof buildRunInput>[0] & { id?: string | null }) | null;
  client: ApolloClient;
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

export const action: ActionFunction<RouterContextProvider> = async ({ context, request }) => {
  const client = context.get(apolloClientContext);
  try {
    const options = (await request.json()) as UpdateEventOptions;
    await updateEvent({ ...options, client });
    return redirect(`/admin_events/${options.eventCategory.id}`);
  } catch (error) {
    return error;
  }
};

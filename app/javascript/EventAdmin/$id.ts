import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';
import { CreateOrUpdateRunForEventDocument, UpdateEventDocument } from './mutations.generated';
import { redirect } from 'react-router';
import { Route } from './+types/$id';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { EventAdminRootQueryData } from './queries.generated';
import { apolloClientContext } from 'AppContexts';

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
    await client.resetStore();
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
    await updateEvent({ ...options, client: context.get(apolloClientContext) });
    return redirect(`/admin_events/${options.eventCategory.id}`);
  } catch (error) {
    return error;
  }
}

import { buildEventInput, buildRunInput } from './InputBuilders';
import { CreateEventDocument, CreateFillerEventDocument } from './mutations.generated';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';
import { redirect } from 'react-router';
import { Route } from './+types/create';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { apolloClientContext } from 'AppContexts';

export type CreateRegularEventOptions = {
  client: ApolloClient<NormalizedCacheObject>;
  event: Parameters<typeof buildEventInput>[0];
  signedImageBlobIds?: string[];
};

export async function createRegularEvent({ event, signedImageBlobIds, client }: CreateRegularEventOptions) {
  return await client.mutate({
    mutation: CreateEventDocument,
    variables: {
      input: { ...buildEventInput(event), signedImageBlobIds },
    },
    update: (cache, { data }) => {
      if (data) {
        cache.modify({
          id: cache.identify(data.createEvent.event.convention),
          fields: {
            events: (value, { INVALIDATE }) => INVALIDATE,
          },
        });
      }
    },
  });
}

export type CreateSingleRunEventOptions = {
  client: ApolloClient<NormalizedCacheObject>;
  event: Parameters<typeof buildEventInput>[0];
  run: Parameters<typeof buildRunInput>[0];
  signedImageBlobIds?: string[];
};

export async function createSingleRunEvent({ event, run, signedImageBlobIds, client }: CreateSingleRunEventOptions) {
  return await client.mutate({
    mutation: CreateFillerEventDocument,
    variables: {
      input: {
        ...buildEventInput(event, {
          can_play_concurrently: false,
          con_mail_destination: 'event_email',
          author: '{{ convention.name }} Staff',
        }),
        ...buildRunInput(run),
        signedImageBlobIds,
      },
    },
    update: (cache, { data }) => {
      if (data) {
        cache.modify({
          id: cache.identify(data.createFillerEvent.event.convention),
          fields: {
            events: (value, { INVALIDATE }) => INVALIDATE,
          },
        });
      }
    },
  });
}

export type CreateEventOptions = {
  client: ApolloClient<NormalizedCacheObject>;
  event: Parameters<typeof buildEventInput>[0];
  eventCategory: Pick<EventCategory, 'scheduling_ui' | 'id'>;
  run?: Parameters<typeof buildRunInput>[0];
  signedImageBlobIds?: string[];
};

async function createEvent({ event, eventCategory, run, signedImageBlobIds, client }: CreateEventOptions) {
  if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
    if (!run) {
      throw new Error('When creating a single-run event, the run must be provided');
    }
    return await createSingleRunEvent({ event, run, signedImageBlobIds, client });
  }

  return await createRegularEvent({ event, signedImageBlobIds, client });
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const options = (await request.json()) as Omit<CreateEventOptions, 'client'>;
    await createEvent({ ...options, client: context.get(apolloClientContext) });
    return redirect(`/admin_events/${options.eventCategory.id}`);
  } catch (error) {
    return error;
  }
}

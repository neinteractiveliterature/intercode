import { buildEventInput, buildRunInput } from './InputBuilders';
import { CreateEventDocument, CreateFillerEventDocument } from './mutations.generated';
import { SchedulingUi } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';

export type CreateRegularEventOptions = {
  event: Parameters<typeof buildEventInput>[0];
  signedImageBlobIds?: string[];
};

export async function createRegularEvent({ event, signedImageBlobIds }: CreateRegularEventOptions) {
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
  event: Parameters<typeof buildEventInput>[0];
  run: Parameters<typeof buildRunInput>[0];
  signedImageBlobIds?: string[];
};

export async function createSingleRunEvent({ event, run, signedImageBlobIds }: CreateSingleRunEventOptions) {
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
  event: Parameters<typeof buildEventInput>[0];
  eventCategory: { scheduling_ui: SchedulingUi };
  run?: Parameters<typeof buildRunInput>[0];
  signedImageBlobIds?: string[];
};

export async function createEvent({ event, eventCategory, run, signedImageBlobIds }: CreateEventOptions) {
  if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
    if (!run) {
      throw new Error('When creating a single-run event, the run must be provided');
    }
    return await createSingleRunEvent({ event, run, signedImageBlobIds });
  }

  return await createRegularEvent({ event, signedImageBlobIds });
}

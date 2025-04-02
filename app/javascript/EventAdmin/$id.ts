import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventCategory, SchedulingUi } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';
import { CreateOrUpdateRunForEventDocument, UpdateEventDocument } from './mutations.generated';
import { ActionFunction, redirect } from 'react-router';

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
};

async function updateEvent({ event, eventCategory, run }: UpdateEventOptions) {
  if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
    if (!run) {
      throw new Error('When updating a single-run event, the run must be provided');
    }
    return await updateSingleRunEvent({ event, run });
  }

  return await updateRegularEvent({ event });
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const options = (await request.json()) as UpdateEventOptions;
    await updateEvent(options);
    return redirect(`/admin_events/${options.eventCategory.id}`);
  } catch (error) {
    return error;
  }
};

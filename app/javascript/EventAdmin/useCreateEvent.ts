import { useCallback } from 'react';

import { buildEventInput, buildRunInput } from './InputBuilders';
import { EventAdminEventsQueryData, EventFieldsFragmentDoc } from './queries.generated';
import {
  CreateEventMutationData,
  CreateEventMutationVariables,
  CreateFillerEventMutationData,
  CreateFillerEventMutationVariables,
  useCreateEventMutation,
  useCreateFillerEventMutation,
} from './mutations.generated';
import { SchedulingUi } from '../graphqlTypes.generated';
import { MutationTuple } from '@apollo/client';
import { useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform/dist';

export type CreateRegularEventResult = ReturnType<
  MutationTuple<CreateEventMutationData, CreateEventMutationVariables>[0]
>;

export function useCreateRegularEvent(
  convention: EventAdminEventsQueryData['convention'],
): (options: {
  event: Parameters<typeof buildEventInput>[0];
  signedImageBlobIds?: string[];
}) => CreateRegularEventResult {
  const [mutate] = useCreateMutationWithReferenceArrayUpdater(
    useCreateEventMutation,
    convention,
    'events',
    (data) => data.createEvent.event,
    EventFieldsFragmentDoc,
    'EventFields',
  );

  const createEvent = useCallback(
    ({ event, signedImageBlobIds }: { event: Parameters<typeof buildEventInput>[0]; signedImageBlobIds?: string[] }) =>
      mutate({
        variables: {
          input: { ...buildEventInput(event), signedImageBlobIds },
        },
      }),
    [mutate],
  );

  return createEvent;
}

export type CreateSingleRunEventResult = ReturnType<
  MutationTuple<CreateFillerEventMutationData, CreateFillerEventMutationVariables>[0]
>;

export function useCreateSingleRunEvent(
  convention: EventAdminEventsQueryData['convention'],
): (options: {
  event: Parameters<typeof buildEventInput>[0];
  run: Parameters<typeof buildRunInput>[0];
  signedImageBlobIds?: string[];
}) => CreateSingleRunEventResult {
  const [mutate] = useCreateMutationWithReferenceArrayUpdater(
    useCreateFillerEventMutation,
    convention,
    'events',
    (data) => data.createFillerEvent.event,
    EventFieldsFragmentDoc,
    'EventFields',
  );

  return useCallback(
    ({
      event,
      run,
      signedImageBlobIds,
    }: {
      event: Parameters<typeof buildEventInput>[0];
      run: Parameters<typeof buildRunInput>[0];
      signedImageBlobIds?: string[];
    }) =>
      mutate({
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
      }),
    [mutate],
  );
}

export type CreateEventOptions = {
  event: Parameters<typeof buildEventInput>[0];
  eventCategory: { scheduling_ui: SchedulingUi };
  run?: Parameters<typeof buildRunInput>[0];
  signedImageBlobIds?: string[];
};

export type CreateEventResult = CreateRegularEventResult | CreateSingleRunEventResult;

export default function useCreateEvent(
  convention: EventAdminEventsQueryData['convention'],
): (options: CreateEventOptions) => CreateEventResult {
  const createRegularEvent = useCreateRegularEvent(convention);
  const createSingleRunEvent = useCreateSingleRunEvent(convention);

  const createEvent = useCallback(
    ({
      event,
      eventCategory,
      run,
      signedImageBlobIds,
    }: {
      event: Parameters<typeof buildEventInput>[0];
      eventCategory: { scheduling_ui: SchedulingUi };
      run?: Parameters<typeof buildRunInput>[0];
      signedImageBlobIds?: string[];
    }) => {
      if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
        if (!run) {
          throw new Error('When creating a single-run event, the run must be provided');
        }
        return createSingleRunEvent({ event, run, signedImageBlobIds });
      }

      return createRegularEvent({ event, signedImageBlobIds });
    },
    [createRegularEvent, createSingleRunEvent],
  );

  return createEvent;
}

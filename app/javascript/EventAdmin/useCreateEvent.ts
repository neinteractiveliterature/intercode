import { useCallback } from 'react';

import { buildEventInput, buildRunInput } from './InputBuilders';
import { CreateEvent, CreateFillerEvent } from './mutations';
import { EventAdminEventsQuery } from './queries';
import { useCreateMutation } from '../MutationUtils';
import { EventAdminEventsQueryData, EventAdminEventsQueryVariables } from './queries.generated';
import {
  CreateEventMutationData,
  CreateEventMutationVariables,
  CreateFillerEventMutationData,
  CreateFillerEventMutationVariables,
} from './mutations.generated';
import { SchedulingUi } from '../graphqlTypes.generated';
import { MutationTuple } from '@apollo/client';

export type CreateRegularEventResult = ReturnType<
  MutationTuple<CreateEventMutationData, CreateEventMutationVariables>[0]
>;

export function useCreateRegularEvent(): (options: {
  event: Parameters<typeof buildEventInput>[0];
}) => CreateRegularEventResult {
  const mutate = useCreateMutation<
    EventAdminEventsQueryData,
    EventAdminEventsQueryVariables,
    CreateEventMutationVariables,
    CreateEventMutationData
  >(CreateEvent, {
    query: EventAdminEventsQuery,
    arrayPath: ['events'],
    newObjectPath: ['createEvent', 'event'],
  });

  const createEvent = useCallback(
    ({ event }: { event: Parameters<typeof buildEventInput>[0] }) =>
      mutate({
        variables: {
          input: buildEventInput(event),
        },
      }),
    [mutate],
  );

  return createEvent;
}

export type CreateSingleRunEventResult = ReturnType<
  MutationTuple<CreateFillerEventMutationData, CreateFillerEventMutationVariables>[0]
>;

export function useCreateSingleRunEvent(): (options: {
  event: Parameters<typeof buildEventInput>[0];
  run: Parameters<typeof buildRunInput>[0];
}) => CreateSingleRunEventResult {
  const mutate = useCreateMutation<
    EventAdminEventsQueryData,
    EventAdminEventsQueryVariables,
    CreateFillerEventMutationVariables,
    CreateFillerEventMutationData
  >(CreateFillerEvent, {
    query: EventAdminEventsQuery,
    arrayPath: ['events'],
    newObjectPath: ['createFillerEvent', 'event'],
  });

  return useCallback(
    ({
      event,
      run,
    }: {
      event: Parameters<typeof buildEventInput>[0];
      run: Parameters<typeof buildRunInput>[0];
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
};

export type CreateEventResult = CreateRegularEventResult | CreateSingleRunEventResult;

export default function useCreateEvent(): (options: CreateEventOptions) => CreateEventResult {
  const createRegularEvent = useCreateRegularEvent();
  const createSingleRunEvent = useCreateSingleRunEvent();

  const createEvent = useCallback(
    ({
      event,
      eventCategory,
      run,
    }: {
      event: Parameters<typeof buildEventInput>[0];
      eventCategory: { scheduling_ui: SchedulingUi };
      run?: Parameters<typeof buildRunInput>[0];
    }) => {
      if (eventCategory.scheduling_ui === SchedulingUi.SingleRun) {
        if (!run) {
          throw new Error('When creating a single-run event, the run must be provided');
        }
        return createSingleRunEvent({ event, run });
      }

      return createRegularEvent({ event });
    },
    [createRegularEvent, createSingleRunEvent],
  );

  return createEvent;
}

import { useCallback } from 'react';

import { buildEventInput, buildRunInput } from './InputBuilders';
import { CreateEvent, CreateFillerEvent } from './mutations.gql';
import { EventAdminEventsQuery } from './queries.gql';
import { useCreateMutation } from '../MutationUtils';

export function useCreateRegularEvent() {
  const mutate = useCreateMutation(CreateEvent, {
    query: EventAdminEventsQuery,
    arrayPath: ['events'],
    newObjectPath: ['createEvent', 'event'],
  });

  const createEvent = useCallback(
    ({ event }) => mutate({
      variables: {
        input: buildEventInput(event),
      },
    }),
    [mutate],
  );

  return createEvent;
}

export function useCreateSingleRunEvent() {
  const mutate = useCreateMutation(CreateFillerEvent, {
    query: EventAdminEventsQuery,
    arrayPath: ['events'],
    newObjectPath: ['createFillerEvent', 'event'],
  });

  return useCallback(
    ({ event, run }) => mutate({
      variables: {
        ...buildEventInput(
          event,
          {
            can_play_concurrently: false,
            con_mail_destination: 'event_email',
            author: '{{ convention.name }} Staff',
          },
        ),
        ...buildRunInput(run),
      },
    }),
    [mutate],
  );
}

export default function useCreateEvent() {
  const createRegularEvent = useCreateRegularEvent();
  const createSingleRunEvent = useCreateSingleRunEvent();

  const createEvent = useCallback(
    ({ event, eventCategory, ...args }) => {
      if (eventCategory.scheduling_ui === 'single_run') {
        return createSingleRunEvent({ event, ...args });
      }

      return createRegularEvent({ event, ...args });
    },
    [createRegularEvent, createSingleRunEvent],
  );

  return createEvent;
}

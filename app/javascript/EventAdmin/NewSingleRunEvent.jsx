import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { buildEventInput, buildRunInput } from './SingleRunEventUtils';
import { CreateFillerEvent } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import SingleRunEventForm from './SingleRunEventForm';
import useAsyncFunction from '../useAsyncFunction';
import useMutationCallback from '../useMutationCallback';
import useQuerySuspended from '../useQuerySuspended';
import useValueUnless from '../useValueUnless';
import usePageTitle from '../usePageTitle';

function useCreateSingleRunEvent() {
  const mutate = useMutationCallback(CreateFillerEvent);

  return useCallback(
    async ({ event, run }) => {
      const input = {
        ...buildEventInput(
          event,
          {
            can_play_concurrently: false,
            con_mail_destination: 'event_email',
            author: '{{ convention.name }} Staff',
          },
        ),
        ...buildRunInput(run),
      };

      await mutate({
        variables: { input },
        update: (store, { data: { createFillerEvent: { event: newEvent } } }) => {
          const eventsData = store.readQuery({ query: EventAdminEventsQuery });
          eventsData.events.push(newEvent);
          store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
        },
      });
    },
    [mutate],
  );
}

function NewSingleRunEvent({ history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const [create, createError, createInProgress] = useAsyncFunction(useCreateSingleRunEvent());

  const createFillerEvent = useCallback(
    async ({ event, run }) => {
      await create({ event, run });
      history.push('/admin_events/filler_events');
    },
    [create, history],
  );

  usePageTitle('New Single-Run Event', useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <SingleRunEventForm
        disabled={createInProgress}
        error={createError ? createError.message : null}
        initialEvent={{
          event_category: { id: null },
          form_response_attrs: {
            email: '',
            short_blurb: '',
            description: '',
            title: '',
            registration_policy: { buckets: [] },
          },
          runs: [{ rooms: [] }],
        }}
        convention={data.convention}
        cancelPath="/admin_events/filler_events"
        onSave={createFillerEvent}
      />
    </div>
  );
}

NewSingleRunEvent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(NewSingleRunEvent);

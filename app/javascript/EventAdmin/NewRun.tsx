import { useState } from 'react';
import { useNavigate, LoaderFunction, useLoaderData, ActionFunction, redirect } from 'react-router';

import EditRunModal, { EditingRun } from './EditRunModal';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument, RunFieldsFragmentDoc } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { CreateRunDocument } from './mutations.generated';
import { buildRunInputFromFormData } from './buildRunInputFromFormData';
import { Event } from '../graphqlTypes.generated';

export async function action({ params: { eventCategoryId, eventId }, request }) {
  try {
    const formData = await request.formData();
    await client.mutate({
      mutation: CreateRunDocument,
      variables: {
        input: {
          eventId: eventId ?? '',
          run: buildRunInputFromFormData(formData),
        },
      },
      update: (cache, result) => {
        const run = result.data?.createRun.run;
        if (run) {
          const runRef = cache.writeFragment({ data: run, fragment: RunFieldsFragmentDoc, fragmentName: 'RunFields' });
          cache.modify<Event>({
            id: cache.identify({ __typename: 'Event', id: eventId }),
            fields: {
              runs: (value) => [...value, runRef],
            },
          });
        }
      },
    });
    return redirect(`/admin_events/${eventCategoryId}`);
  } catch (error) {
    return error;
  }
}

type LoaderResult = {
  initialRun: EditingRun;
  event: EventAdminEventsQueryData['convention']['events'][number];
  convention: EventAdminEventsQueryData['convention'];
};

export async function loader({ params: { eventId } }) {
  const {
    data: { convention },
  } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  const events = convention.events;
  const event = events.find((e) => e.id.toString() === eventId);

  if (!event) {
    return new Response(null, { status: 404 });
  }

  const initialRun: EditingRun = {
    __typename: 'Run',
    id: '',
    my_signups: [],
    my_signup_requests: [],
    my_signup_ranked_choices: [],
    starts_at: undefined,
    title_suffix: undefined,
    schedule_note: undefined,
    rooms: [],
    room_names: [],
    confirmed_signup_count: 0,
    not_counted_signup_count: 0,
    grouped_signup_counts: [],
  };

  return { initialRun, event, convention } as LoaderResult;
}

function NewRun(): JSX.Element {
  const navigate = useNavigate();
  const { event, initialRun, convention } = useLoaderData() as LoaderResult;

  const cancelEditing = () => {
    navigate('../../../..', { replace: true });
  };

  const [run, setRun] = useState(initialRun);

  return (
    <EditRunModal
      formProps={{ action: '.', method: 'POST' }}
      convention={convention}
      editingRunChanged={setRun}
      event={event}
      onCancel={cancelEditing}
      run={run}
    />
  );
}

export default NewRun;

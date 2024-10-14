import { useState } from 'react';
import { useNavigate, LoaderFunction, useLoaderData, ActionFunction, redirect } from 'react-router';

import EditRunModal, { EditingRun } from './EditRunModal';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { UpdateRunDocument } from './mutations.generated';
import { buildRunInputFromFormData } from './buildRunInputFromFormData';

export const action: ActionFunction = async ({ params: { eventCategoryId, runId }, request }) => {
  try {
    const formData = await request.formData();
    await client.mutate({
      mutation: UpdateRunDocument,
      variables: {
        input: {
          id: runId ?? '',
          run: buildRunInputFromFormData(formData),
        },
      },
    });
    return redirect(`/admin_events/${eventCategoryId}`);
  } catch (error) {
    return error;
  }
};

type LoaderResult = {
  initialRun: EditingRun;
  event: EventAdminEventsQueryData['convention']['events'][number];
  convention: EventAdminEventsQueryData['convention'];
};

export const loader: LoaderFunction = async ({ params: { eventId, runId } }) => {
  const {
    data: { convention },
  } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  const events = convention.events;
  const event = events.find((e) => e.id.toString() === eventId);
  const initialRun = event?.runs.find((r) => r.id === runId) as EditingRun;

  if (event && initialRun) {
    return { event, initialRun, convention } satisfies LoaderResult;
  } else {
    return new Response(null, { status: 404 });
  }
};

function EditRun(): JSX.Element {
  const navigate = useNavigate();
  const { event, initialRun, convention } = useLoaderData() as LoaderResult;

  const cancelEditing = () => {
    navigate('../../../..', { replace: true });
  };

  const [run, setRun] = useState(initialRun);

  return (
    <EditRunModal
      formProps={{ action: '.', method: 'PATCH' }}
      convention={convention}
      editingRunChanged={setRun}
      event={event}
      onCancel={cancelEditing}
      run={run}
    />
  );
}

export const Component = EditRun;

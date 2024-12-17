import { useState } from 'react';
import { useNavigate, redirect } from 'react-router';

import EditRunModal, { EditingRun } from './EditRunModal';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { UpdateRunDocument } from './mutations.generated';
import { buildRunInputFromFormData } from './buildRunInputFromFormData';
import { Route } from './+types/EditRun';

export async function action({ params: { eventCategoryId, runId }, request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    await context.client.mutate({
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
}

export async function loader({ params: { eventId, runId }, context }: Route.LoaderArgs) {
  const {
    data: { convention },
  } = await context.client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  const events = convention.events;
  const event = events.find((e) => e.id.toString() === eventId);
  const initialRun = event?.runs.find((r) => r.id === runId) as EditingRun;

  if (event && initialRun) {
    return { event, initialRun, convention };
  } else {
    throw new Response(null, { status: 404 });
  }
}

function EditRun({ loaderData: { event, initialRun, convention } }: Route.ComponentProps): JSX.Element {
  const navigate = useNavigate();

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

export default EditRun;

import { useState } from 'react';
import { useActionData, useNavigate, useLoaderData, redirect } from 'react-router';

import EditRunModal, { EditingRun } from './EditRunModal';
import { EventAdminEventsQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import { UpdateRunDocument } from './mutations.generated';
import { buildRunInputFromFormData } from './buildRunInputFromFormData';
import type { Route } from './+types/EditRun';

export const clientAction = async ({
  params: { eventCategoryId, runId },
  request,
  context,
}: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
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

export const clientLoader = async ({ params: { eventId, runId }, context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument, errorPolicy: 'none' });
  const convention = data?.convention;
  const events = convention?.events;
  const event = events?.find((e) => e.id.toString() === eventId);
  const initialRun = event?.runs.find((r) => r.id === runId) as EditingRun;

  if (convention && event && initialRun) {
    return { event, initialRun, convention };
  } else {
    return new Response(null, { status: 404 });
  }
};

function EditRun(): React.JSX.Element {
  const navigate = useNavigate();
  const { event, initialRun, convention } = useLoaderData<typeof clientLoader>();

  const cancelEditing = () => {
    navigate('../../../..', { replace: true });
  };

  const [run, setRun] = useState(initialRun);
  const actionData = useActionData<typeof clientAction>();

  return (
    <EditRunModal
      formProps={{ action: '.', method: 'PATCH' }}
      convention={convention}
      editingRunChanged={setRun}
      event={event}
      onCancel={cancelEditing}
      error={actionData instanceof Error ? actionData : undefined}
      run={run}
    />
  );
}

export default EditRun;

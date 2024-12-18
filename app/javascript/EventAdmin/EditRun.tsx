import { useState } from 'react';
import { useNavigate, redirect } from 'react-router';

import EditRunModal, { EditingRun } from './EditRunModal';
import { UpdateRunDocument } from './mutations.generated';
import { buildRunInputFromFormData } from './buildRunInputFromFormData';
import { Route } from './+types/EditRun';
import { EditRunQueryDocument } from './queries.generated';

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

export async function loader({ params: { runId }, context }: Route.LoaderArgs) {
  const {
    data: { convention },
  } = await context.client.query({ query: EditRunQueryDocument, variables: { runId } });
  const initialRun = convention.run as EditingRun;
  const event = convention.run.event;

  if (initialRun) {
    return { initialRun, convention, event };
  } else {
    throw new Response(null, { status: 404 });
  }
}

function EditRun({ loaderData: { initialRun, convention, event } }: Route.ComponentProps): JSX.Element {
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

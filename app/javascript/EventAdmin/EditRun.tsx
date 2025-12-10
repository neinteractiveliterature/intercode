import { useState } from 'react';
import {
  useNavigate,
  LoaderFunction,
  useLoaderData,
  ActionFunction,
  redirect,
  RouterContextProvider,
} from 'react-router';

import EditRunModal, { EditingRun } from './EditRunModal';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { apolloClientContext } from '~/AppContexts';
import { UpdateRunDocument } from './mutations.generated';
import { buildRunInputFromFormData } from './buildRunInputFromFormData';

export const action: ActionFunction<RouterContextProvider> = async ({
  params: { eventCategoryId, runId },
  request,
  context,
}) => {
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

type LoaderResult = {
  initialRun: EditingRun;
  event: EventAdminEventsQueryData['convention']['events'][number];
  convention: EventAdminEventsQueryData['convention'];
};

export const loader: LoaderFunction<RouterContextProvider> = async ({ params: { eventId, runId }, context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  const convention = data?.convention;
  const events = convention?.events;
  const event = events?.find((e) => e.id.toString() === eventId);
  const initialRun = event?.runs.find((r) => r.id === runId) as EditingRun;

  if (convention && event && initialRun) {
    return { event, initialRun, convention } satisfies LoaderResult;
  } else {
    return new Response(null, { status: 404 });
  }
};

function EditRun(): React.JSX.Element {
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

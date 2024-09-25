import { useState } from 'react';
import { useNavigate, redirect } from 'react-router';

import EditRunModal, { EditingRun } from './EditRunModal';
import { NewRunQueryDocument, RunFieldsFragmentDoc } from './queries.generated';
import { CreateRunDocument } from './mutations.generated';
import { buildRunInputFromFormData } from './buildRunInputFromFormData';
import { Event } from '../graphqlTypes.generated';
import { Route } from './+types/NewRun';

export async function action({ params: { eventCategoryId, eventId }, request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    await context.client.mutate({
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

const initialRun: EditingRun = {
  __typename: 'Run',
  id: '',
  starts_at: undefined,
  title_suffix: undefined,
  schedule_note: undefined,
  rooms: [],
  room_names: [],
};

export async function loader({ params: { eventId }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: NewRunQueryDocument, variables: { eventId } });
  const convention = data.convention;
  const event = convention.event;

  if (!event) {
    throw new Response(null, { status: 404 });
  }

  return { event, convention };
}

function NewRun({ loaderData: { event, convention } }: Route.ComponentProps): JSX.Element {
  const navigate = useNavigate();

  const cancelEditing = () => {
    navigate('../..', { replace: true });
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

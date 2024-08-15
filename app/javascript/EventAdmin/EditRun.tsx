import { useEffect, useState } from 'react';
import { useNavigate, useLocation, LoaderFunction, useLoaderData } from 'react-router-dom';

import EditRunModal, { EditingRun } from './EditRunModal';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import {
  EventAdminEventsQueryData,
  EventAdminEventsQueryDocument,
  useEventAdminEventsQuerySuspenseQuery,
} from './queries.generated';
import { client } from '../useIntercodeApolloClient';

type LoaderResult = {
  initialRun: EditingRun;
  event: EventAdminEventsQueryData['convention']['events'][number];
};

export const loader: LoaderFunction = async ({ request, params: { eventId, runId } }) => {
  const {
    data: { convention },
  } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  const events = convention.events;
  const event = events.find((e) => e.id.toString() === eventId);

  if (new URL(request.url).pathname.endsWith('/new')) {
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

    return { initialRun, event } as LoaderResult;
  }

  const initialRun = event?.runs.find((r) => r.id === runId) as EditingRun;

  if (initialRun) {
    return { event, initialRun } as LoaderResult;
  } else {
    return new Response(null, { status: 404 });
  }
};

function EditRun(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: { convention },
  } = useEventAdminEventsQuerySuspenseQuery();

  const { event, initialRun } = useLoaderData() as LoaderResult;

  const cancelEditing = () => {
    if (!event) {
      return;
    }
    const eventCategoryUrl = buildEventCategoryUrl(
      convention.event_categories.find((c) => c.id === event.event_category.id),
    );
    if (eventCategoryUrl) {
      navigate(eventCategoryUrl, { replace: true });
    }
  };

  const [run, setRun] = useState(initialRun);

  useEffect(() => {
    // navigation happened, reset the run state
    setRun(initialRun);
  }, [location.pathname, initialRun]);

  if (!event || !run) {
    return <></>;
  }

  return (
    <EditRunModal
      convention={convention}
      editingRunChanged={setRun}
      event={event}
      onCancel={cancelEditing}
      onDelete={cancelEditing}
      onSaveStart={() => {}}
      onSaveSucceeded={cancelEditing}
      onSaveFailed={() => {}}
      run={run}
    />
  );
}

export const Component = EditRun;

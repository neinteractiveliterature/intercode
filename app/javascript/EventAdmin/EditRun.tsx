import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import EditRunModal, { EditingRun } from './EditRunModal';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import { EventAdminEventsQueryData, EventFieldsFragment } from './queries.generated';

export type EditRunProps = {
  convention: EventAdminEventsQueryData['convention'];
  events: EventFieldsFragment[];
};

function EditRun({ convention, events }: EditRunProps): JSX.Element {
  const params = useParams<{ eventId: string; runId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const event = useMemo(() => {
    if (params.eventId == null) {
      return undefined;
    }

    return events.find((e) => e.id.toString() === params.eventId);
  }, [params.eventId, events]);

  const initialRun: EditingRun | undefined = useMemo(() => {
    if (!event) {
      return undefined;
    }

    if (location.pathname.endsWith('/new')) {
      return {
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
    }

    return event.runs.find((r) => r.id === params.runId);
  }, [location.pathname, params.runId, event]);

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

export default EditRun;

import { useEffect, useMemo, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import EditRunModal, { EditingRun } from './EditRunModal';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import { ConventionFieldsFragment, EventFieldsFragment } from './queries.generated';

export type EditRunProps = {
  convention: ConventionFieldsFragment;
  events: EventFieldsFragment[];
};

function EditRun({ convention, events }: EditRunProps): JSX.Element {
  const match = useRouteMatch<{ eventId: string; runId: string }>();
  const history = useHistory();
  const event = useMemo(() => {
    if (!match) {
      return undefined;
    }

    return events.find((e) => e.id.toString() === match.params.eventId);
  }, [match, events]);

  const initialRun: EditingRun | undefined = useMemo(() => {
    if (!event) {
      return undefined;
    }

    if (match.path.endsWith('/new')) {
      return {
        __typename: 'Run',
        id: '',
        my_signups: [],
        my_signup_requests: [],
        starts_at: undefined,
        title_suffix: undefined,
        schedule_note: undefined,
        rooms: [],
        room_names: [],
        confirmed_signup_count: 0,
        not_counted_signup_count: 0,
        signup_count_by_state_and_bucket_key_and_counted: '{}',
      };
    }

    return event.runs.find((r) => r.id === match.params.runId);
  }, [match.path, match.params.runId, event]);

  const cancelEditing = () => {
    if (!event) {
      return;
    }
    const eventCategoryUrl = buildEventCategoryUrl(
      convention.event_categories.find((c) => c.id === event.event_category.id),
    );
    if (eventCategoryUrl) {
      history.replace(eventCategoryUrl);
    }
  };

  const [run, setRun] = useState(initialRun);

  useEffect(() => {
    // navigation happened, reset the run state
    setRun(initialRun);
  }, [match.path, initialRun]);

  if (!event || !run) {
    return <></>;
  }

  return (
    <EditRunModal
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

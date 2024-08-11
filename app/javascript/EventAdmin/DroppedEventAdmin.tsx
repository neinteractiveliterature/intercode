import { useConfirm, ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { useEventAdminEventsQuery } from './queries.generated';
import { useRestoreDroppedEventMutation } from './mutations.generated';

export const Component = LoadQueryWrapper(useEventAdminEventsQuery, function DroppedEventAdmin({ data }): JSX.Element {
  const [restoreDroppedEvent] = useRestoreDroppedEventMutation();
  const confirm = useConfirm();

  usePageTitle('Dropped Events');

  const droppedEvents = data.convention.events.filter((event) => {
    const eventCategory = data.convention.event_categories.find((c) => c.id === event.event_category.id);
    return event.status === 'dropped' && eventCategory?.scheduling_ui !== 'single_run';
  });
  droppedEvents.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' }));

  if (droppedEvents.length === 0) {
    return (
      <p className="mt-2">
        There are no dropped events to display. (Single-run events that are dropped cannot be restored.)
      </p>
    );
  }

  const rows = droppedEvents.map((droppedEvent) => (
    <tr key={droppedEvent.id}>
      <td>{droppedEvent.title}</td>
      <td className="text-end">
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() =>
            confirm({
              prompt: `Are you sure you want to restore this event?  (Scheduled runs and
              previous signups will not be restored.)`,
              action: () => restoreDroppedEvent({ variables: { input: { id: droppedEvent.id } } }),
              renderError: (restoreError) => <ErrorDisplay graphQLError={restoreError} />,
            })
          }
        >
          Restore
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="mt-2">
      <table className="table table-striped">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
});

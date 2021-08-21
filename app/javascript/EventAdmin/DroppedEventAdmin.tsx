import { useConfirm, ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { useEventAdminEventsQuery } from './queries.generated';
import { useRestoreDroppedEventMutation } from './mutations.generated';

function DroppedEventAdmin() {
  const { data, loading, error } = useEventAdminEventsQuery();
  const [restoreDroppedEvent] = useRestoreDroppedEventMutation();
  const confirm = useConfirm();

  usePageTitle('Dropped Events');

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const droppedEvents = data!.events.filter((event) => {
    const eventCategory = data!.convention.event_categories.find(
      (c) => c.id === event.event_category.id,
    );
    return event.status === 'dropped' && eventCategory?.scheduling_ui !== 'single_run';
  });
  droppedEvents.sort((a, b) =>
    (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' }),
  );

  if (droppedEvents.length === 0) {
    return (
      <p className="mt-2">
        There are no dropped events to display. (Single-run events that are dropped cannot be
        restored.)
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
}

export default DroppedEventAdmin;

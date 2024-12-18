import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { useSubmit } from 'react-router';
import { Route } from './+types/DroppedEventAdmin';
import { DroppedEventsAdminQueryDocument } from './queries.generated';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: DroppedEventsAdminQueryDocument });
  return data;
}

function DroppedEventAdmin({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const confirm = useConfirm();
  const submit = useSubmit();
  const droppedEvents = data.convention.events_paginated.entries;

  usePageTitle('Dropped Events');

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
              action: () =>
                submit(
                  {},
                  {
                    action: `/admin_events/${droppedEvent.event_category.id}/events/${droppedEvent.id}/restore`,
                    method: 'POST',
                  },
                ),
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

import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { useSubmit } from 'react-router';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query({ query: EventAdminEventsQueryDocument });
  return data;
};

function DroppedEventAdmin(): JSX.Element {
  const data = useLoaderData() as EventAdminEventsQueryData;
  const confirm = useConfirm();
  const submit = useSubmit();

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

export const Component = DroppedEventAdmin;

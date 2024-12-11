import { useMemo } from 'react';
import capitalize from 'lodash/capitalize';
import flatMap from 'lodash/flatMap';
import sum from 'lodash/sum';
import { sortByLocaleString, titleSort, useTabs, TabList, TabBody } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { EventProvidedTicketsQueryData, EventProvidedTicketsQueryDocument } from './queries.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';

function EventProvidedTicketsByEvent({ data }: { data: EventProvidedTicketsQueryData }) {
  const sortedRows = titleSort(
    data.convention.reports.event_provided_tickets,
    (row) => row.provided_by_event.title ?? '',
  );

  return (
    <>
      {sortedRows.map((row) => (
        <section className="mt-2" key={row.provided_by_event.id}>
          <p className="fw-bold mb-0">{row.provided_by_event.title}</p>
          <ul className="list-unstyled">
            {sortByLocaleString(row.tickets, (ticket) => ticket.user_con_profile.name_inverted).map((ticket) => (
              <li key={ticket.id}>
                {ticket.user_con_profile.name_inverted}
                <span className="text-muted"> ({ticket.ticket_type.description})</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function EventProvidedTicketsByUser({ data }: { data: EventProvidedTicketsQueryData }) {
  const sortedRows = useMemo(() => {
    const unsortedRows = flatMap(
      data.convention.reports.event_provided_tickets,
      ({ provided_by_event: event, tickets }) => tickets.map((ticket) => ({ ticket, event })),
    );

    return sortByLocaleString(unsortedRows, (row) => row.ticket.user_con_profile.name_inverted);
  }, [data]);

  return (
    <table className="table table-striped mt-4">
      <thead>
        <tr>
          <th className="border-top-0">User</th>
          <th className="border-top-0">Event</th>
          <th className="border-top-0">{capitalize(data.convention.ticket_name)}</th>
        </tr>
      </thead>
      <tbody>
        {sortedRows.map(({ ticket, event }) => (
          <tr key={ticket.id}>
            <td>{ticket.user_con_profile.name_inverted}</td>
            <td>{event.title}</td>
            <td>{ticket.ticket_type.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export async function loader() {
  const { data } = await client.query<EventProvidedTicketsQueryData>({ query: EventProvidedTicketsQueryDocument });
  return data;
}

function EventProvidedTickets() {
  const data = useLoaderData() as EventProvidedTicketsQueryData;
  const tabProps = useTabs([
    {
      id: 'by-event',
      name: 'By event',
      renderContent: () => <EventProvidedTicketsByEvent data={data} />,
    },
    {
      id: 'by-user',
      name: 'By user',
      renderContent: () => <EventProvidedTicketsByUser data={data} />,
    },
  ]);

  usePageTitle(`Event-provided ${data.convention.ticketNamePlural}`);
  const totalCount = useMemo(
    () => sum(data.convention.reports.event_provided_tickets.map((row) => row.tickets.length)),
    [data.convention.reports.event_provided_tickets],
  );

  return (
    <>
      <h1>
        {'Event-provided '}
        {data.convention.ticketNamePlural}
        {' report'}
      </h1>
      <h3 className="mb-4">
        {'Total: '}
        {totalCount}
        {totalCount === 1
          ? ` event-provided ${data.convention.ticket_name}`
          : ` event-provided ${data.convention.ticketNamePlural}`}
      </h3>
      <TabList {...tabProps} />
      <TabBody {...tabProps} />
    </>
  );
}

export default EventProvidedTickets;

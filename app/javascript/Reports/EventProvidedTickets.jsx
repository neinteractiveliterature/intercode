import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { pluralize, capitalize } from 'inflected';
import flatMap from 'lodash-es/flatMap';
import sum from 'lodash-es/sum';
import { useQuery } from 'react-apollo-hooks';

import { EventProvidedTicketsQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import { sortByLocaleString, titleSort } from '../ValueUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import { useTabs, TabList, TabBody } from '../UIComponents/Tabs';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EventProvidedTicketsByEvent({ data }) {
  const sortedRows = titleSort(
    data.convention.reports.event_provided_tickets,
    (row) => row.provided_by_event.title,
  );

  return sortedRows.map((row) => (
    <section className="mt-2" key={row.provided_by_event.id}>
      <p className="font-weight-bold mb-0">{row.provided_by_event.title}</p>
      <ul className="list-unstyled">
        {sortByLocaleString(row.tickets, (ticket) => ticket.user_con_profile.name_inverted)
          .map((ticket) => (
            <li key={ticket.id}>
              {ticket.user_con_profile.name_inverted}
              <span className="text-muted">
                {' ('}
                {ticket.ticket_type.description}
                {')'}
              </span>
            </li>
          ))}
      </ul>
    </section>
  ));
}

EventProvidedTicketsByEvent.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

function EventProvidedTicketsByUser({ data }) {
  const sortedRows = useMemo(
    () => {
      const unsortedRows = flatMap(
        data.convention.reports.event_provided_tickets,
        ({ provided_by_event: event, tickets }) => tickets.map((ticket) => ({ ticket, event })),
      );

      return sortByLocaleString(unsortedRows, (row) => row.ticket.user_con_profile.name_inverted);
    },
    [data],
  );

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

EventProvidedTicketsByUser.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

function EventProvidedTickets() {
  const { data, loading, error } = useQuery(EventProvidedTicketsQuery);
  const tabProps = useTabs([
    {
      id: 'by-event',
      name: 'By event',
      renderContent: () => !loading && !error && <EventProvidedTicketsByEvent data={data} />,
    },
    {
      id: 'by-user',
      name: 'By user',
      renderContent: () => !loading && !error && <EventProvidedTicketsByUser data={data} />,
    },
  ]);

  usePageTitle(useValueUnless(
    () => `Event-provided ${pluralize(data.convention.ticket_name)}`,
    error || loading,
  ));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1>
        {'Event-provided '}
        {pluralize(data.convention.ticket_name)}
        {' report'}
      </h1>
      <h3 className="mb-4">
        {'Total: '}
        {pluralizeWithCount(
          `event-provided ${data.convention.ticket_name}`,
          sum(data.convention.reports.event_provided_tickets.map((row) => row.tickets.length)),
        )}
      </h3>
      <TabList {...tabProps} />
      <TabBody {...tabProps} />
    </>
  );
}

export default EventProvidedTickets;

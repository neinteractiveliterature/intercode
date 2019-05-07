import React from 'react';
import { pluralize } from 'inflected';
import { sum } from 'lodash-es';

import { EventProvidedTicketsQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import { sortByLocaleString } from '../ValueUtils';
import pluralizeWithCount from '../pluralizeWithCount';

function EventProvidedTickets() {
  const { data, error } = useQuerySuspended(EventProvidedTicketsQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const sortedRows = sortByLocaleString(
    data.convention.reports.event_provided_tickets,
    row => row.provided_by_event.title.replace(/^(the|a) /i, '').replace(/\W/, ''),
  );

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
          sum(sortedRows.map(row => row.tickets.length)),
        )}
      </h3>
    </>
  );
}

export default EventProvidedTickets;

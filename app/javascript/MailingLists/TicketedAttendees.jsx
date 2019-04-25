import React from 'react';

import ErrorDisplay from '../ErrorDisplay';
import { TicketedAttendeesQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import TabbedMailingList from './TabbedMailingList';

function TicketedAttendees() {
  const { data, error } = useQuerySuspended(TicketedAttendeesQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">
        Mail to all attendees with
        {' '}
        {data.convention.ticket_name}
      </h1>

      <TabbedMailingList
        emails={data.convention.mailing_lists.ticketed_attendees.emails}
        metadataFields={data.convention.mailing_lists.ticketed_attendees.metadata_fields}
        csvFilename={`All attendees with ${data.convention.ticket_name} - ${data.convention.name}.csv`}
      />
    </>
  );
}

export default TicketedAttendees;

import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { TicketedAttendeesQuery } from './queries.gql';
import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function TicketedAttendees() {
  const { data, loading, error } = useQuery(TicketedAttendeesQuery);

  usePageTitle(useValueUnless(
    () => `All attendees with ${data.convention.ticket_name}`, error || loading,
  ));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

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

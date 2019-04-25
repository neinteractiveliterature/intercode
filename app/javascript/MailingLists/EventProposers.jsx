import React from 'react';

import ErrorDisplay from '../ErrorDisplay';
import { EventProposersQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import TabbedMailingList from './TabbedMailingList';

function EventProposers() {
  const { data, error } = useQuerySuspended(EventProposersQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Mail to all event proposers</h1>

      <TabbedMailingList
        emails={data.convention.mailing_lists.event_proposers.emails}
        metadataFields={data.convention.mailing_lists.event_proposers.metadata_fields}
        csvFilename={`Event proposers - ${data.convention.name}.csv`}
      />
    </>
  );
}

export default EventProposers;

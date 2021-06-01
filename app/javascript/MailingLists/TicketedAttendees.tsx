import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { useTicketedAttendeesQuery } from './queries.generated';

export default LoadQueryWrapper(useTicketedAttendeesQuery, function TicketedAttendees({ data }) {
  usePageTitle(`All attendees with ${data.convention.ticket_name}`);

  return (
    <>
      <h1 className="mb-4">Mail to all attendees with {data.convention.ticket_name}</h1>

      <TabbedMailingList
        emails={data.convention.mailing_lists.ticketed_attendees.emails}
        metadataFields={data.convention.mailing_lists.ticketed_attendees.metadata_fields}
        csvFilename={`All attendees with ${data.convention.ticket_name} - ${data.convention.name}.csv`}
      />
    </>
  );
});

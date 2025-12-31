import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TicketedAttendeesQueryData, TicketedAttendeesQueryDocument } from './queries.generated';
import { useLoaderData } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { Route } from './+types/TicketedAttendees';

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: TicketedAttendeesQueryDocument });
  return data;
};

function TicketedAttendees() {
  const data = useLoaderData() as TicketedAttendeesQueryData;
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
}

export default TicketedAttendees;

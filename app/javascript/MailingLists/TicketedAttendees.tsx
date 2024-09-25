import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TicketedAttendeesQueryDocument } from './queries.generated';
import { Route } from './+types/TicketedAttendees';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: TicketedAttendeesQueryDocument });
  return data;
}

function TicketedAttendees({ loaderData: data }: Route.ComponentProps) {
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

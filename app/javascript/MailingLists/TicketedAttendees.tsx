import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TicketedAttendeesQueryData, TicketedAttendeesQueryDocument } from './queries.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<TicketedAttendeesQueryData>({ query: TicketedAttendeesQueryDocument });
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

export const Component = TicketedAttendees;

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { EventProposersQueryData, EventProposersQueryDocument } from './queries.generated';
import { apolloClientContext } from '../AppContexts';
import { useLoaderData } from 'react-router';
import { Route } from './+types/EventProposers';

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventProposersQueryDocument });
  return data;
};

function EventProposers() {
  const data = useLoaderData() as EventProposersQueryData;
  usePageTitle('Event proposers');

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

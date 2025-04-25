import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { EventProposersQueryDocument } from './queries.generated';
import { Route } from './+types/EventProposers';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: EventProposersQueryDocument });
  return data;
}

function EventProposers({ loaderData: data }: Route.ComponentProps) {
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

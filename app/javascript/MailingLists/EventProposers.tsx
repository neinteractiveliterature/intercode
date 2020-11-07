import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { useEventProposersQueryQuery } from './queries.generated';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';

export default LoadQueryWrapper(useEventProposersQueryQuery, function EventProposers({ data }) {
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
});

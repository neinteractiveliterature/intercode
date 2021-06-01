import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { useEventProposersQuery } from './queries.generated';

export default LoadQueryWrapper(useEventProposersQuery, function EventProposers({ data }) {
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

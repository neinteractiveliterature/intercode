import React from 'react';

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { useTeamMembersMailingListQueryQuery } from './queries.generated';

export default LoadQueryWrapper(useTeamMembersMailingListQueryQuery, function TeamMembers({
  data,
}) {
  usePageTitle('Event team members');

  return (
    <>
      <h1 className="mb-4">Mail to all event team members</h1>

      <TabbedMailingList
        emails={data.convention.mailing_lists.team_members.emails}
        metadataFields={data.convention.mailing_lists.team_members.metadata_fields}
        csvFilename={`Event team members - ${data.convention.name}.csv`}
      />
    </>
  );
});

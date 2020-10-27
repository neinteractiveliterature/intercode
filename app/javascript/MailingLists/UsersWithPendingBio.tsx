import React from 'react';

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { useUsersWithPendingBioQueryQuery } from './queries.generated';

export default LoadQueryWrapper(useUsersWithPendingBioQueryQuery, function UsersWithPendingBio({
  data,
}) {
  usePageTitle('Users with pending bio');

  return (
    <>
      <h1 className="mb-4">Mail to all users with pending bio</h1>

      <TabbedMailingList
        emails={data.convention.mailing_lists.users_with_pending_bio.emails}
        metadataFields={data.convention.mailing_lists.users_with_pending_bio.metadata_fields}
        csvFilename={`Users with pending bio - ${data.convention.name}.csv`}
      />
    </>
  );
});

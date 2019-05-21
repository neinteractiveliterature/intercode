import React from 'react';

import ErrorDisplay from '../ErrorDisplay';
import { UsersWithPendingBioQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function UsersWithPendingBio() {
  const { data, error } = useQuerySuspended(UsersWithPendingBioQuery);

  usePageTitle('Users with pending bio', useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
}

export default UsersWithPendingBio;

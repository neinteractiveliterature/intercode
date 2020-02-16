import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { UsersWithPendingBioQuery } from './queries.gql';
import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function UsersWithPendingBio() {
  const { data, loading, error } = useQuery(UsersWithPendingBioQuery);

  usePageTitle('Users with pending bio');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

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

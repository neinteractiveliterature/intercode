import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { TeamMembersMailingListQuery } from './queries.gql';
import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function TeamMembers() {
  const { data, loading, error } = useQuery(TeamMembersMailingListQuery);

  usePageTitle('Event team members', useValueUnless(() => data.convention, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
}

export default TeamMembers;

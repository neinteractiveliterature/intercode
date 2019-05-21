import React from 'react';

import ErrorDisplay from '../ErrorDisplay';
import { TeamMembersMailingListQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function TeamMembers() {
  const { data, error } = useQuerySuspended(TeamMembersMailingListQuery);

  usePageTitle('Event team members', useValueUnless(() => data.convention, error));

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

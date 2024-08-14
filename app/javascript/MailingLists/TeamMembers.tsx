import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TeamMembersMailingListQueryData, TeamMembersMailingListQueryDocument } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { LoaderFunction, useLoaderData } from 'react-router';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<TeamMembersMailingListQueryData>({ query: TeamMembersMailingListQueryDocument });
  return data;
};

function TeamMembers() {
  const data = useLoaderData() as TeamMembersMailingListQueryData;
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
}

export const Component = TeamMembers;

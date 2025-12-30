import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TeamMembersMailingListQueryData, TeamMembersMailingListQueryDocument } from './queries.generated';
import { apolloClientContext } from '../AppContexts';
import { useLoaderData } from 'react-router';
import { Route } from './+types/TeamMembers';

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: TeamMembersMailingListQueryDocument });
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

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TeamMembersMailingListQueryDocument } from './queries.generated';
import { Route } from './+types/TeamMembers';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({
    query: TeamMembersMailingListQueryDocument,
  });
  return data;
}

function TeamMembers({ loaderData: data }: Route.ComponentProps) {
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

export default TeamMembers;

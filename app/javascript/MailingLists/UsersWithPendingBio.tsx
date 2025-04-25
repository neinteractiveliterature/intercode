import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { UsersWithPendingBioQueryDocument } from './queries.generated';
import { Route } from './+types/UsersWithPendingBio';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: UsersWithPendingBioQueryDocument });
  return data;
}

function UsersWithPendingBio({ loaderData: data }: Route.ComponentProps) {
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
}

export default UsersWithPendingBio;

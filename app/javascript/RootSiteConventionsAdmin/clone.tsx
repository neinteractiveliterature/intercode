import NewConventionModal from './NewConventionModal';
import { ConventionDisplayQueryDocument, NewConventionModalQueryDocument } from './queries.generated';
import { Route } from './+types/clone';
import { apolloClientContext } from 'AppContexts';

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const [{ data: conventionData }, { data }] = await Promise.all([
    context.get(apolloClientContext).query({ query: ConventionDisplayQueryDocument, variables: { id } }),
    context.get(apolloClientContext).query({ query: NewConventionModalQueryDocument }),
  ]);
  return { data, cloneConvention: conventionData.convention };
}

function CloneConventionRoute({ loaderData: { data, cloneConvention } }: Route.ComponentProps) {
  return <NewConventionModal data={data} cloneConvention={cloneConvention} />;
}

export default CloneConventionRoute;

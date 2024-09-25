import NewConventionModal from './NewConventionModal';
import { ConventionDisplayQueryDocument, NewConventionModalQueryDocument } from './queries.generated';
import { Route } from './+types/clone';

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const [{ data: conventionData }, { data }] = await Promise.all([
    context.client.query({ query: ConventionDisplayQueryDocument, variables: { id } }),
    context.client.query({ query: NewConventionModalQueryDocument }),
  ]);
  return { data, cloneConvention: conventionData.convention };
}

function CloneConventionRoute({ loaderData: { data, cloneConvention } }: Route.ComponentProps) {
  return <NewConventionModal data={data} cloneConvention={cloneConvention} />;
}

export default CloneConventionRoute;

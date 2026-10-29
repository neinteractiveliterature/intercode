import { useLoaderData } from 'react-router';
import NewConventionModal from './NewConventionModal';
import { apolloClientContext } from 'AppContexts';
import { ConventionDisplayQueryDocument, NewConventionModalQueryDocument } from './queries.generated';
import type { Route } from './+types/clone';

export const clientLoader = async ({ context, params: { id } }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const [{ data: conventionData }, { data }] = await Promise.all([
    client.query({ query: ConventionDisplayQueryDocument, variables: { id: id ?? '' }, errorPolicy: 'none' }),
    client.query({ query: NewConventionModalQueryDocument, errorPolicy: 'none' }),
  ]);
  if (!data || !conventionData) {
    return new Response(null, { status: 404 });
  }
  return { data, cloneConvention: conventionData.convention };
};

function CloneConventionRoute() {
  const { data, cloneConvention } = useLoaderData<typeof clientLoader>();
  return <NewConventionModal data={data} cloneConvention={cloneConvention} />;
}

export default CloneConventionRoute;

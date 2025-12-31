import { useLoaderData } from 'react-router';
import NewConventionModal, { NewConventionModalProps } from './NewConventionModal';
import { apolloClientContext } from '~/AppContexts';
import {
  ConventionDisplayQueryDocument,
  NewConventionModalQueryData,
  NewConventionModalQueryDocument,
} from './queries.generated';
import { Route } from './+types/clone';

type LoaderResult = {
  data: NewConventionModalQueryData;
  cloneConvention: NonNullable<NewConventionModalProps['cloneConvention']>;
};

export const clientLoader = async ({ context, params: { id } }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const [{ data: conventionData }, { data }] = await Promise.all([
    client.query({ query: ConventionDisplayQueryDocument, variables: { id: id ?? '' } }),
    client.query({ query: NewConventionModalQueryDocument }),
  ]);
  if (!data || !conventionData) {
    return new Response(null, { status: 404 });
  }
  return { data, cloneConvention: conventionData.convention } satisfies LoaderResult;
};

function CloneConventionRoute() {
  const { data, cloneConvention } = useLoaderData() as LoaderResult;
  return <NewConventionModal data={data} cloneConvention={cloneConvention} />;
}

export default CloneConventionRoute;

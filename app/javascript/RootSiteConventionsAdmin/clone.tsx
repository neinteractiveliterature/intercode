import { LoaderFunction, useLoaderData } from 'react-router';
import NewConventionModal, { NewConventionModalProps } from './NewConventionModal';
import { client } from 'useIntercodeApolloClient';
import {
  ConventionDisplayQueryDocument,
  NewConventionModalQueryData,
  NewConventionModalQueryDocument,
} from './queries.generated';

type LoaderResult = {
  data: NewConventionModalQueryData;
  cloneConvention: NonNullable<NewConventionModalProps['cloneConvention']>;
};

export async function loader({ params: { id } }) {
  const [{ data: conventionData }, { data }] = await Promise.all([
    client.query({ query: ConventionDisplayQueryDocument, variables: { id } }),
    client.query({ query: NewConventionModalQueryDocument }),
  ]);
  return { data, cloneConvention: conventionData.convention } satisfies LoaderResult;
}

function CloneConventionRoute() {
  const { data, cloneConvention } = useLoaderData() as LoaderResult;
  return <NewConventionModal data={data} cloneConvention={cloneConvention} />;
}

export default CloneConventionRoute;

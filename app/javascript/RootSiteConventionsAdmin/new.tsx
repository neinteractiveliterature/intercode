import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'react-router';
import NewConventionModal from './NewConventionModal';
import { client } from 'useIntercodeApolloClient';
import { NewConventionModalQueryData, NewConventionModalQueryDocument } from './queries.generated';
import { CreateConventionDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request }) => {
  try {
    const variables = await request.json();
    const { data } = await client.mutate({
      mutation: CreateConventionDocument,
      variables,
    });

    return redirect(`/conventions/${data?.createConvention.convention.id}`);
  } catch (error) {
    return error;
  }
};

export const loader: LoaderFunction = async () => {
  const { data } = await client.query({ query: NewConventionModalQueryDocument });
  return data;
};

function NewConventionRoute() {
  const data = useLoaderData() as NewConventionModalQueryData;
  return <NewConventionModal data={data} />;
}

export default NewConventionRoute;

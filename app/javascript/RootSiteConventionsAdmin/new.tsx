import { ActionFunction, LoaderFunction, redirect, useLoaderData, RouterContextProvider } from 'react-router';
import NewConventionModal from './NewConventionModal';
import { apolloClientContext } from '~/AppContexts';
import { NewConventionModalQueryData, NewConventionModalQueryDocument } from './queries.generated';
import { CreateConventionDocument } from './mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ request, context }) => {
  const client = context.get(apolloClientContext);
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

export const clientLoader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: NewConventionModalQueryDocument });
  return data;
};

function NewConventionRoute() {
  const data = useLoaderData() as NewConventionModalQueryData;
  return <NewConventionModal data={data} />;
}

export const Component = NewConventionRoute;

import { redirect } from 'react-router';
import NewConventionModal from './NewConventionModal';
import { NewConventionModalQueryDocument } from './queries.generated';
import { CreateConventionDocument } from './mutations.generated';
import { Route } from './+types/new';

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const variables = await request.json();
    const { data } = await context.client.mutate({
      mutation: CreateConventionDocument,
      variables,
    });

    return redirect(`/conventions/${data?.createConvention.convention.id}`);
  } catch (error) {
    return error;
  }
}

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: NewConventionModalQueryDocument });
  return data;
}

function NewConventionRoute({ loaderData: data }: Route.ComponentProps) {
  return <NewConventionModal data={data} />;
}

export default NewConventionRoute;

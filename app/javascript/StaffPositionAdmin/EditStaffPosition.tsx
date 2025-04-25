import { useState } from 'react';
import { redirect, useFetcher } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import StaffPositionForm from './StaffPositionForm';
import usePageTitle from '../usePageTitle';
import buildStaffPositionInput from './buildStaffPositionInput';
import { StaffPositionsQueryDocument } from './queries.generated';
import { UpdateStaffPositionDocument } from './mutations.generated';
import { StaffPositionInput } from 'graphqlTypes.generated';
import { Route } from './+types/EditStaffPosition';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    const staffPosition = (await request.json()) as StaffPositionInput;
    await context.get(apolloClientContext).mutate({
      mutation: UpdateStaffPositionDocument,
      variables: { input: { id, staff_position: staffPosition } },
    });
    return redirect('/staff_positions');
  } catch (error) {
    return error;
  }
}

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: StaffPositionsQueryDocument });
  const initialStaffPosition = data.convention.staff_positions.find((staffPosition) => staffPosition.id === id);
  if (!initialStaffPosition) {
    throw new Response(null, { status: 404 });
  }

  return { initialStaffPosition };
}

function EditStaffPosition({ loaderData: { initialStaffPosition } }: Route.ComponentProps) {
  const [staffPosition, setStaffPosition] = useState(initialStaffPosition);
  const fetcher = useFetcher();
  const updateError = fetcher.data instanceof Error ? fetcher.data : undefined;
  const requestInProgress = fetcher.state !== 'idle';

  usePageTitle(`Editing “${initialStaffPosition.name}”`);

  const saveClicked = () => {
    fetcher.submit(buildStaffPositionInput(staffPosition), { encType: 'application/json', method: 'PATCH' });
  };

  return (
    <div>
      <h1 className="mb-4">Editing {initialStaffPosition.name}</h1>
      <StaffPositionForm staffPosition={staffPosition} onChange={setStaffPosition} />
      <ErrorDisplay graphQLError={updateError as ApolloError} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={requestInProgress}>
        Save changes
      </button>
    </div>
  );
}

export default EditStaffPosition;

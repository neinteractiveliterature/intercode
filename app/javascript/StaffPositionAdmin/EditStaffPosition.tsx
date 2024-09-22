import { useState } from 'react';
import { ActionFunction, LoaderFunction, redirect, useFetcher, useLoaderData } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import StaffPositionForm from './StaffPositionForm';
import usePageTitle from '../usePageTitle';
import buildStaffPositionInput from './buildStaffPositionInput';
import { StaffPositionsQueryData, StaffPositionsQueryDocument } from './queries.generated';
import { UpdateStaffPositionDocument } from './mutations.generated';
import { client } from '../useIntercodeApolloClient';
import { StaffPositionInput } from 'graphqlTypes.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    const staffPosition = (await request.json()) as StaffPositionInput;
    await client.mutate({
      mutation: UpdateStaffPositionDocument,
      variables: { input: { id, staff_position: staffPosition } },
    });
    return redirect('/staff_positions');
  } catch (error) {
    return error;
  }
};

type LoaderResult = {
  initialStaffPosition: StaffPositionsQueryData['convention']['staff_positions'][number];
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<StaffPositionsQueryData>({ query: StaffPositionsQueryDocument });
  const initialStaffPosition = data.convention.staff_positions.find((staffPosition) => staffPosition.id === id);
  if (!initialStaffPosition) {
    return new Response(null, { status: 404 });
  }

  return { initialStaffPosition } satisfies LoaderResult;
};

function EditStaffPosition() {
  const { initialStaffPosition } = useLoaderData() as LoaderResult;
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

export const Component = EditStaffPosition;

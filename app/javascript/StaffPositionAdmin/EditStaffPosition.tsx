import { useState, useCallback } from 'react';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import StaffPositionForm from './StaffPositionForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import buildStaffPositionInput from './buildStaffPositionInput';
import { StaffPositionsQueryData, StaffPositionsQueryDocument } from './queries.generated';
import { useUpdateStaffPositionMutation } from './mutations.generated';
import { client } from '../useIntercodeApolloClient';

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
  const navigate = useNavigate();
  const [staffPosition, setStaffPosition] = useState(initialStaffPosition);
  const [updateMutate] = useUpdateStaffPositionMutation();
  const [mutate, updateError, requestInProgress] = useAsyncFunction(updateMutate);

  usePageTitle(`Editing “${initialStaffPosition.name}”`);

  const saveClicked = useCallback(async () => {
    await mutate({
      variables: {
        input: {
          id: staffPosition.id,
          staff_position: buildStaffPositionInput(staffPosition),
        },
      },
    });
    navigate('/staff_positions');
  }, [mutate, staffPosition, navigate]);

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

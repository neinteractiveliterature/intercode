import { useState, useCallback } from 'react';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import StaffPositionForm, { EditingStaffPosition } from './StaffPositionForm';
import usePageTitle from '../usePageTitle';
import buildStaffPositionInput from './buildStaffPositionInput';
import { useCreateStaffPositionMutation } from './mutations.generated';
import {
  StaffPositionFieldsFragmentDoc,
  StaffPositionsQueryData,
  StaffPositionsQueryDocument,
} from './queries.generated';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<StaffPositionsQueryData>({ query: StaffPositionsQueryDocument });
  return data;
};

function NewStaffPosition(): JSX.Element {
  const data = useLoaderData() as StaffPositionsQueryData;
  const navigate = useNavigate();
  const [createMutate, { error, loading: inProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateStaffPositionMutation,
    data.convention,
    'staff_positions',
    (data) => data.createStaffPosition.staff_position,
    StaffPositionFieldsFragmentDoc,
    'StaffPositionFields',
  );

  const [staffPosition, setStaffPosition] = useState<EditingStaffPosition>({
    __typename: 'StaffPosition',
    id: '',
    name: '',
    email: '',
    user_con_profiles: [],
    cc_addresses: [],
    email_aliases: [],
    permissions: [],
  });

  const saveClicked = useCallback(async () => {
    const response = await createMutate({
      variables: {
        input: {
          staff_position: buildStaffPositionInput(staffPosition),
        },
      },
    });
    if (response?.data) {
      navigate(`/staff_positions/${response.data.createStaffPosition.staff_position.id}/edit_permissions`, {
        replace: true,
      });
    }
  }, [navigate, createMutate, staffPosition]);

  usePageTitle('New staff position');

  return (
    <div>
      <h1 className="mb-4">New staff position</h1>
      <StaffPositionForm staffPosition={staffPosition} onChange={setStaffPosition} />
      <ErrorDisplay graphQLError={error as ApolloError} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save
      </button>
    </div>
  );
}

export const Component = NewStaffPosition;

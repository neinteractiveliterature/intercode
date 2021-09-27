import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import StaffPositionForm, { EditingStaffPosition } from './StaffPositionForm';
import { StaffPositionsQuery } from './queries';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import buildStaffPositionInput from './buildStaffPositionInput';
import { useCreateStaffPositionMutation } from './mutations.generated';
import { StaffPositionsQueryData } from './queries.generated';

function NewStaffPosition(): JSX.Element {
  const history = useHistory();
  const [createMutate] = useCreateStaffPositionMutation({
    update: (proxy, result) => {
      const data = proxy.readQuery<StaffPositionsQueryData>({ query: StaffPositionsQuery });
      const newStaffPosition = result.data?.createStaffPosition?.staff_position;
      if (!data || !newStaffPosition) {
        return;
      }

      proxy.writeQuery({
        query: StaffPositionsQuery,
        data: {
          ...data,
          convention: {
            ...data.convention,
            staff_positions: [...data.convention.staff_positions, newStaffPosition],
          },
        },
      });
    },
  });
  const [mutate, error, inProgress] = useAsyncFunction(createMutate);

  const [staffPosition, setStaffPosition] = useState<EditingStaffPosition>({
    __typename: 'StaffPosition',
    id: 0,
    name: '',
    email: '',
    user_con_profiles: [],
    cc_addresses: [],
    email_aliases: [],
    permissions: [],
  });

  const saveClicked = useCallback(async () => {
    const response = await mutate({
      variables: {
        input: {
          staff_position: buildStaffPositionInput(staffPosition),
        },
      },
    });
    if (response?.data) {
      history.replace(
        `/staff_positions/${response.data.createStaffPosition.staff_position.id}/edit_permissions`,
      );
    }
  }, [history, mutate, staffPosition]);

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

export default NewStaffPosition;

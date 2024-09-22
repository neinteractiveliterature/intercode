import { useState } from 'react';
import { ActionFunction, redirect, useFetcher } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import StaffPositionForm, { EditingStaffPosition } from './StaffPositionForm';
import usePageTitle from '../usePageTitle';
import buildStaffPositionInput from './buildStaffPositionInput';
import { StaffPositionsQueryDocument } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { StaffPositionInput } from 'graphqlTypes.generated';
import { CreateStaffPositionDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === 'POST') {
      const staffPosition = (await request.json()) as StaffPositionInput;
      const { data } = await client.mutate({
        mutation: CreateStaffPositionDocument,
        variables: { input: { staff_position: staffPosition } },
        refetchQueries: [{ query: StaffPositionsQueryDocument }],
        awaitRefetchQueries: true,
      });
      return redirect(`/staff_positions/${data?.createStaffPosition.staff_position.id}/edit_permissions`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

function NewStaffPosition(): JSX.Element {
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

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

  const saveClicked = () => {
    fetcher.submit(buildStaffPositionInput(staffPosition), { method: 'POST', encType: 'application/json' });
  };

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

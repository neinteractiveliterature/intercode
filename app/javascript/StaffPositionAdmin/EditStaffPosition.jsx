import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import StaffPositionForm from './StaffPositionForm';
import StaffPositionPropType from './StaffPositionPropType';
import { UpdateStaffPosition } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';

function EditStaffPosition({ initialStaffPosition }) {
  const history = useHistory();
  const [staffPosition, setStaffPosition] = useState(initialStaffPosition);
  const [updateMutate] = useMutation(UpdateStaffPosition);
  const [mutate, error, requestInProgress] = useAsyncFunction(updateMutate);

  usePageTitle(`Editing “${initialStaffPosition.name}”`);

  const saveClicked = useCallback(
    async () => {
      await mutate({
        variables: {
          input: {
            id: staffPosition.id,
            staff_position: {
              name: staffPosition.name,
              email: staffPosition.email,
              visible: staffPosition.visible,
              user_con_profile_ids: (staffPosition.user_con_profiles || []).map((
                (userConProfile) => userConProfile.id
              )),
            },
          },
        },
      });
      history.push('/staff_positions');
    },
    [mutate, staffPosition, history],
  );

  return (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {initialStaffPosition.name}
      </h1>
      <StaffPositionForm
        staffPosition={staffPosition}
        onChange={setStaffPosition}
      />
      <ErrorDisplay graphQLError={error} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={requestInProgress}>
        Save changes
      </button>
    </div>
  );
}

EditStaffPosition.propTypes = {
  initialStaffPosition: StaffPositionPropType.isRequired,
};

export default EditStaffPosition;
